<template>
  <m-drag-context>
    <v-container fluid>
      <m-vuewer
        v-if="!isLoading && $source"
        ref="video"
        :src="$source"
        :fps="$fps"
        :frames="frames"
        :origin-size="$originSize"
        :textgrid="textgrid"
        @run-noise-reduction="onNoiseReduction"
        @data-updated="onDataUpdated"
        @textgrid-updated="onTextGridUpdated"
        @frame-point-updated="onFramePointUpdated"
        @frame-rect-updated="onFrameRectUpdated"
        @frame-point-deleted="onFramePointDeleted"
        @frame-rect-deleted="onFrameRectDeleted"
        @download-json="downloadJson"
      />
    </v-container>
  </m-drag-context>
</template>
<script>
import db from "@/storage/db";
import MVuewer from "@/components/MVuewer";
import MVideoTWBMixin from "@/mixins/MVideoTWBMixin";
import MDragContext from "@/components/contextmenus/MDragContext.vue";
import io from "@/io";
export default {
  name: "vuewer",
  mixins: [MVideoTWBMixin],
  components: { MVuewer, MDragContext },
  data: () => ({
    id: null,
    item: {}, // DB データ登録用オブジェクト
    frames: [], // フレーム転記情報
    textgrid: {}, // 時系列転記情報
    isLoading: false, // 読み込み状態
    isChange: false // データ変更の有無
  }),
  computed: {
    tag: () => "views:vuewer", // LOG 用識別子
    syncDropbox: function() {
      // ページ離脱時に Dropbox にログを残すか否か
      return this.$store.state.setting.syncDropbox;
    },
    metaData: {
      get() {
        return this.$store.state.current.metaData;
      },
      set(val) {
        this.$store.commit("current/metaData", val);
      }
    },
    source: {
      // 解析動画データ
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
    // 最新データを JSON 形式でダウンロード
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
    // DROPBOX 保存関数
    saveDropbox: async function() {
      if (this.$vuewer.dropbox.hasToken()) {
        this.$vuewer.loading.start("$vuetify.sending");
        const file = await this.$vuewer.db.get(Number(this.id));
        const name = `${file.name.split(".")[0]}.json`;
        const blob = this.$vuewer.io.json.toFile(name, file);
        this.$vuewer.dropbox
          .write("data/" + name, blob)
          .then(() => {
            this.$vuewer.snackbar.success("$vuetify.sended");
            this.isChange = false;
          })
          .catch(res => {
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
     * エラー発生時に呼ばれます.
     */
    onError: function(error, msg = null, next = false) {
      if (msg) {
        this.$vuewer.snackbar.error(msg);
      } else {
        this.$vuewer.snackbar.error(error);
      }
      this.$vuewer.console.error(this.tag, error);
      if (next) this.$router.push({ name: next });
    },
    /**
     * onIdChanged.
     *
     * ルータの id が変更した際に呼ばれます.
     * id を元に indexeddb から直接的に動画の情報を取得し,
     * this.$store.state.current 以下の情報を書き換えます.
     */
    onIdChanged: async function(id) {
      if (id) {
        this.id = id;
        this.$vuewer.console.log(this.tag, `change page id ${id}`);

        this.isChange = false;
        this.isLoading = true;
        this.$vuewer.loading.start("$vuetify.loading");

        this.$initVideo(); // 画面表示する動画情報を初期化する
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
            this.metaData = file.metaData || {};
            this.textgrid = file.textgrid || {};
            console.log(this.textgrid, file.textgrid);
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
    // EVENT ハンドラ
    onNoiseReduction: function(payload) {
      this.isLoading = true;
      this.$vuewer.loading.start("$vuetify.loading");
      setTimeout(() => {
        const buff = this.$vuewer.io.file.toBuff(this.$source);
        let result = null;
        if (payload.type == "afftdn") {
          result = this.$vuewer.io.video.afftdn(buff);
        } else if (payload.type == "anlmdn") {
          result = this.$vuewer.io.video.anlmdn(buff);
        } else if (payload.type == "bandpass") {
          result = this.$vuewer.io.video.bandpass(
            buff,
            payload.low,
            payload.heigh
          );
        }
        if (result !== null && result.MEMFS.length) {
          const out = result.MEMFS[0];
          const blob = new Blob([out.data], { type: "video/mp4" });
          this.$source = null;
          this.$vuewer.io.video.toBase64(blob).then(dst => {
            this.$source = dst;
            this.isLoading = false;
            this.$vuewer.loading.end();
          });
        } else {
          this.isLoading = false;
          this.$vuewer.loading.end();
        }
      }, 1000);
    },
    onTextGridUpdated: function(textgrid) {
      if (textgrid) {
        this.isChange = true;
        const vm = this;
        this.item.textgrid = Object.assign({}, textgrid);
        for (const key in this.item.textgrid) {
          this.item.textgrid[key] = {
            values: this.item.textgrid[key].values,
            type: this.item.textgrid[key].type,
            parent: this.item.textgrid[key].parent
          };
        }
        this.item.lastModifiedAt = Date.now();
        db.files
          .put(this.item)
          .then(id => {
            const msg = `update the textgrid of a file (id=${id})`;
            vm.$store.commit("files/update", this.item);
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
          .then(() => {
            vm.$store.commit("files/update", this.item);
            vm.$vuewer.db.log("rects", "PUT", `change rects`);
          })
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
          .then(() => {
            vm.$store.commit("files/update", this.item);
            vm.$vuewer.db.log("points", "PUT", `change points`);
          })
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
    onDataUpdated: async function(payload) {
      // DB の保存
      this.item.textgrid = Object.assign({}, payload.textgrid);
      for (const key in this.item.textgrid) {
        this.item.textgrid[key] = {
          values: this.item.textgrid[key].values,
          type: this.item.textgrid[key].type,
          parent: this.item.textgrid[key].parent
        };
      }
      this.item.lastModifiedAt = Date.now();
      await db.files.put(this.item);
      for (const frame of payload.frames) {
        if (frame.points && frame.points.length) {
          await db.points.bulkPut(frame.points);
        }
        if (frame.rects && frame.rects.length) {
          await db.rects.bulkPut(frame.rects);
        }
      }
      this.saveDropbox();
    },
    onUnload: function(event) {
      if (this.isChange && this.syncDropbox) {
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
        if (this.syncDropbox && this.isChange) {
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
    this.$initVideo(); // 画面表示する動画情報を初期化する
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
