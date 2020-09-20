<template>
  <v-container fluid>
    <m-vuewer
      v-if="!isLoading && $source"
      ref="video"
      :src="$source"
      :fps="$fps"
      :frames="frames"
      :origin-size="$originSize"
      :textgrid="textgrid"
      @textgrid-updated="onTextGridUpdated"
      @frame-point-updated="onFramePointUpdated"
      @frame-rect-updated="onFrameRectUpdated"
      @frame-point-deleted="onFramePointDeleted"
      @frame-rect-deleted="onFrameRectDeleted"
      @download-json="downloadJson"
      @save-dropbox="saveDropbox"
    />
  </v-container>
</template>
<script>
import db from "@/storage/db";
import MVuewer from "@/components/MVuewer";
import MVideoTWBMixin from "@/mixins/MVideoTWBMixin";
import io from "@/io";
export default {
  name: "vuewer",
  mixins: [MVideoTWBMixin],
  components: { MVuewer },
  data: () => ({
    tag: "views:vuewer",
    videoElm: null,
    frames: [],
    item: {}, // DB データ更新用オブジェクト
    textgrid: {},
    isLoading: false,
    isChange: false
  }),
  computed: {
    syncDropbox: function() {
      return this.$store.state.setting.syncDropbox;
    },
    source: {
      get() {
        return this.$store.state.current.video.source;
      },
      set(val) {
        this.$store.commit("current/video/source", val);
      }
    },
    fps: {
      get() {
        return this.$store.state.current.video.fps;
      },
      set(val) {
        this.$store.commit("current/video/fps", val);
      }
    }
  },
  methods: {
    onError: function(error, msg = null, next = false) {
      if (msg) {
        this.$vuewer.snackbar.error(msg);
      } else {
        this.$vuewer.snackbar.error(error);
      }
      this.$vuewer.console.error(this.tag, error);
      if (next) this.$router.push({ name: next });
    },
    downloadJson: async function() {
      try {
        const file = await this.$vuewer.db.get(Number(this.id));
        const blob = this.$vuewer.io.json.toFile(`${file.bname}.json`, file);
        io.file.download(blob, blob.name);
      } catch (error) {
        if (error.name == "DataError") {
          this.onError(error, "The file does not exist.", "Home");
        } else {
          this.onError(error);
        }
      }
    },
    saveDropbox: async function() {
      if (this.$vuewer.dropbox.hasToken()) {
        this.$vuewer.loading.start("ファイル送信中...");
        const file = await this.$vuewer.db.get(Number(this.id));
        const name = `${file.name.split(".")[0]}.json`;
        const blob = this.$vuewer.io.json.toFile(name, file);
        this.$vuewer.dropbox
          .write("data/" + name, blob)
          .then(res => {
            this.$vuewer.snackbar.success(
              `sended file to ${res.path_display} in dropbox`
            );
            this.isChange = false;
          })
          .catch(res => {
            // res.error.error_summary
            const msg = `DROPBOX ERROR: ${res.status} :${res.error.error_summary}`;
            this.onError(res.error, msg);
          })
          .finally(() => {
            this.$vuewer.loading.end();
          });
      } else {
        this.$vuewer.dropbox.auth();
      }
    },
    /**
     * onIdChanged.
     *
     * ルータの id が変更した際に呼ばれます.
     *
     * これは id を元に動画の情報を取得し,
     * this.$store.state.current 以下の情報を書き換えます.
     */
    onIdChanged: async function(id) {
      if (id) {
        this.isChange = false;
        this.id = id;
        this.$vuewer.console.log(this.tag, `change page id ${id}`);
        this.isLoading = true;
        this.$vuewer.loading.start("$vuetify.loading");
        // 画面表示する動画情報を初期化する
        this.$initVideo();
        try {
          const file = await db.files.get(Number(id));
          this.$vuewer.db.log("files", "GET", `get file ${id}`);
          if (file) {
            this.item = file;
            this.$source = file.source;
            this.$fps = file.fps;
            this.$name = file.name;
            this.$duration = file.duration;
            this.$videoStream = file.videoStream || {};
            this.$audioStream = file.audioStream || {};
            this.$originSize = file.originSize || {};
            this.textgrid = file.textgrid || {};
            this.frames = await db.frames
              .where({ fileId: file.id })
              .with({ points: "points", rects: "rects" });
          } else {
            this.$vuewer.console.error(this.tag, "The file does not exist.");
            this.$vuewer.snackbar.error("The file does not exist.");
            this.$router.push({ name: "Home" });
          }
        } catch (error) {
          if (error.name == "DataError") {
            this.$vuewer.snackbar.error("The file does not exist.");
            this.$vuewer.console.error(this.tag, error);
            this.$router.push({ name: "Home" });
          } else {
            this.$vuewer.snackbar.error(error);
            this.$vuewer.console.error(this.tag, error);
          }
        }
        this.isLoading = false;
        this.$vuewer.loading.end();
      } else {
        this.$vuewer.snackbar.error("There is no id.");
        this.$vuewer.console.error(this.tag, "NO ID ACCESS");
        this.$router.push({ name: "Home" });
      }
    },
    onTextGridUpdated: function(textgrid) {
      if (textgrid) {
        this.isChange = true;
        const vm = this;
        this.item.textgrid = Object.assign({}, textgrid);
        for (const key in this.item.textgrid) {
          this.item.textgrid[key] = {
            parent: textgrid[key].parent,
            type: textgrid[key].type,
            values: textgrid[key].values
          };
        }
        db.files
          .put(this.item)
          .then(id => {
            const msg = `update the textgrid of a file (id=${id})`;
            vm.$vuewer.db.log("textgrid", "PUT", msg);
            vm.$vuewer.console.log("textgrid", msg);
          })
          .catch(error => {
            vm.$vuewer.console.error("vuewer:textgrid:put", error);
          });
      }
    },
    onFrameRectUpdated: function(frame) {
      this.isChange = true;
      const vm = this;
      const tag = "vuewer:onFrameRectUpdated";
      for (const r of frame.rects) {
        const item = {
          id: r.id,
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          rotation: r.rotation,
          scaleX: r.scaleX,
          scaleY: r.scaleY,
          size: r.size,
          color: r.color,
          label: r.label || `rect-${r.id}`,
          frameId: frame.id
        };
        db.rects
          .put(item)
          .then(() => vm.$vuewer.db.log("rects", "PUT", `change rects`))
          .catch(error => {
            vm.$vuewer.snackbar.error(error);
            vm.$vuewer.console.error(tag, error);
          });
      }
    },
    onFramePointUpdated: async function(frame) {
      this.isChange = true;
      const vm = this;
      const tag = "vuewer:onFramePointUpdated";
      for (const i in frame.points) {
        const p = frame.points[i];
        const item = {
          id: p.id,
          x: p.x,
          y: p.y,
          color: p.color,
          size: p.size,
          label: p.label || `point-${p.id}`,
          frameId: frame.id
        };
        db.points
          .put(item)
          .then(() => vm.$vuewer.db.log("points", "PUT", `change points`))
          .catch(error => {
            vm.$vuewer.snackbar.error(error);
            vm.$vuewer.console.error(tag, error);
          });
      }
    },
    onFramePointDeleted: function(point) {
      this.isChange = true;
      const vm = this;
      const tag = "vuewer:onFramePointDeleted";
      db.points
        .delete(point.id)
        .then(() =>
          vm.$vuewer.db.log("points", "DELETE", `delete point ${point.id}`)
        )
        .catch(error => {
          vm.$vuewer.snackbar.error(error);
          vm.$vuewer.console.error(tag, error);
        });
    },
    onFrameRectDeleted: function(rect) {
      this.isChange = true;
      const vm = this;
      const tag = "vuewer:onFrameRectDeleted";
      db.rects
        .delete(rect.id)
        .then(() =>
          vm.$vuewer.db.log("rects", "DELETE", `delete rects ${rect.id}`)
        )
        .catch(error => {
          vm.$vuewer.snackbar.error(error);
          vm.$vuewer.console.error(tag, error);
        });
    },
    onUnload: function(event) {
      if ((this.isChange, this.syncDropbox)) {
        if (this.$vuewer.dropbox.hasToken()) {
          const msg = "Data you've inputted won't be synced in dropbox.";
          event.returnValue = msg;
        }
      }
    }
  },
  watch: {
    "$route.params.id": function(val, old) {
      if (val !== old && val) {
        if (this.syncDropbox) {
          this.saveDropbox()
            .then(() => {
              this.onIdChanged(val);
            })
            .catch(error => {
              this.$vuewer.snackbar.error(error);
              this.onIdChanged(val);
            });
        } else {
          this.onIdChanged(val);
        }
      }
    }
  },
  created: function() {
    window.addEventListener("beforeunload", this.onUnload);
  },
  destroyed: function() {
    window.removeEventListener("beforeunload", this.onUnload);
  },
  mounted: function() {
    const id = this.$route.params.id;
    this.onIdChanged(id);
  },
  // ページ遷移時
  beforeRouteLeave(to, from, next) {
    if ((this.isChange, this.syncDropbox)) {
      if (this.$vuewer.dropbox.hasToken()) {
        this.saveDropbox()
          .then(() => next())
          .catch(() => next(false));
      } else {
        next();
      }
    } else {
      next();
    }
  }
};
</script>
<style scoped></style>
