<template>
  <m-drag-context>
    <v-container fluid>
      <m-vuewer
        v-if="!isLoading && id"
        ref="video"
        :id="id"
        @run-noise-reduction="onNoiseReduction"
        @data-updated="onDataUpdated"
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
        this.id = Number(id);
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

      // for (const frame of payload.frames) {
      //   if (frame.points && frame.points.length) {
      //     await db.points.bulkPut(frame.points);
      //   }
      //   if (frame.rects && frame.rects.length) {
      //     await db.rects.bulkPut(frame.rects);
      //   }
      // }

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
