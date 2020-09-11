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
    />
    <m-loading-dialog v-model="isLoading">
      {{ $vuetify.lang.t("$vuetify.loading") }}
    </m-loading-dialog>
  </v-container>
</template>
<script>
import db from "@/storage/db";
import MVuewer from "@/components/MVuewer";
import MLoadingDialog from "@/components/base/dialog/MLoadingDialog";
import MSnackbarMixin from "@/mixins/MSnackbarMixin";
import MVideoTWBMixin from "@/mixins/MVideoTWBMixin";
export default {
  name: "vuewer",
  mixins: [MVideoTWBMixin, MSnackbarMixin],
  components: {
    MVuewer,
    MLoadingDialog
  },
  data: () => ({
    isLoading: false,
    videoElm: null,
    frames: [],
    item: {}, // DB データ更新用オブジェクト
    textgrid: {}
  }),
  computed: {
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
        this.log({ msg: `change id ${id}` });
        this.isLoading = true;
        // 画面表示する動画情報を初期化する
        this.$initVideo();
        try {
          const file = await db.files.get(Number(id));
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
            this.showError("No file");
            this.$router.push({ name: "Home" });
          }
        } catch (error) {
          if (error.name == "DataError") {
            this.showError("No file");
            this.$router.push({ name: "Home" });
          } else {
            this.showError(error);
          }
        }
        this.isLoading = false;
      } else {
        this.showError("no id");
      }
    },
    log: function(payload) {
      this.$store.commit("logging/log", payload);
    },
    error: function(payload) {
      this.$store.commit("logging/error", payload);
    },
    onTextGridUpdated: function(textgrid) {
      if (textgrid) {
        const vm = this;
        this.item.textgrid = Object.assign({}, textgrid);
        for (const key in this.item.textgrid) {
          this.item.textgrid[key] = {
            type: textgrid[key].type,
            values: textgrid[key].values
          };
        }
        db.files
          .put(this.item)
          .then(id => {
            const msg = `update the textgrid of a file (id=${id})`;
            vm.log({ msg: msg });
          })
          .catch(error => {
            const msg = `failed: update the textgrid of a file (id=${this.item.id})`;
            vm.error({ msg: msg, error: error });
            console.error(error);
          });
      }
    },
    onFrameRectUpdated: function(frame) {
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
        db.rects.put(item).catch(error => this.showError(error));
      }
    },
    onFramePointUpdated: async function(frame) {
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
        db.points.put(item).catch(error => this.showError(error));
      }
    },
    onFramePointDeleted: function(point) {
      db.points.delete(point.id).catch(error => this.showError(error));
    },
    onFrameRectDeleted: function(rect) {
      db.rects.delete(rect.id).catch(error => this.showError(error));
    }
  },
  watch: {
    "$route.params.id": function(val) {
      this.onIdChanged(val);
    }
  },
  mounted: function() {
    const id = this.$route.params.id;
    this.onIdChanged(id);
  }
};
</script>
<style scoped></style>
