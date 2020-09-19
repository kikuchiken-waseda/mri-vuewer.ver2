<template>
  <v-card
    @mouseover="$emit('mouseover')"
    v-resize="onResize"
    :style="canvasWrapperStyle"
    :flat="flat"
    :tile="tile"
  >
    <m-key-context :style="canvasWrapperStyle" @keyup="onKeyup">
      <video
        ref="video"
        :style="videoStyle"
        @loadeddata="onLoaded"
        @timeupdate="onTimeupdate"
        :muted="muted"
        :src="src"
      />
      <v-stage
        @click="onClickEvent($event, 'click')"
        @dblclick="onClickEvent($event, 'dblclick')"
        :style="canvasStyle"
        ref="stage"
        :config="canvas"
      >
        <v-layer v-if="$store.state.setting.showPointsInVideo">
          <v-circle v-for="(x, i) in frame.circles" :key="i" :config="x" />
        </v-layer>
        <v-layer v-if="$store.state.setting.showRectsInVideo">
          <v-rect v-for="(x, i) in frame.rects" :key="i" :config="x" />
        </v-layer>
        <v-layer>
          <v-text v-for="(x, i) in frame.texts" :key="i" :config="x" />
        </v-layer>
        <v-layer v-if="$store.state.setting.showFrameInVideo">
          <v-text :config="label" />
        </v-layer>
      </v-stage>
    </m-key-context>

    <v-card-actions v-if="controls">
      <v-btn dark icon color="primary" @click="downloadImage">
        <v-icon dark>mdi-file-download</v-icon>
      </v-btn>

      <v-spacer />
      <v-btn dark icon color="primary" @click="play">
        <v-icon dark>mdi-play</v-icon>
      </v-btn>
      <v-btn dark icon color="primary" @click="pause">
        <v-icon dark>mdi-pause</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import utils from "@/utils";
import MKeyContext from "@/components/contextmenus/MKeyContext";

export default {
  name: "m-video",
  components: { MKeyContext },
  props: {
    src: {
      type: String,
      required: true
    },
    frames: {
      type: Array,
      default: function() {
        return [];
      }
    },
    originSize: {
      type: Object,
      default: function() {
        return {
          width: null,
          height: null
        };
      }
    },
    defaultPointColor: {
      type: String,
      default: "white"
    },
    defaultRectColor: {
      type: String,
      default: "white"
    },
    muted: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: true,
    video: {
      image: null
    },
    // 動画現在時刻のフレーム
    frame: {
      idx: null,
      time: null,
      circles: [],
      rects: [],
      texts: []
    },
    // キャンバス設定
    canvas: {
      width: 0,
      height: 0
    },
    videoStyle: {
      width: "100%",
      height: "auto"
    },
    canvasWrapperStyle: {
      position: "relative"
    },
    canvasStyle: {
      position: "absolute",
      top: 0,
      left: 0
    }
  }),
  watch: {
    frames: function() {
      const currentTime = this.getCurrentTime();
      this.syncFrame(currentTime);
    }
  },
  computed: {
    label: function() {
      const idx = this.$vuewer.math.padding(this.frame.idx, 3);
      const fsize = Math.round(this.canvas.height / 15);
      return {
        x: fsize / 2,
        text: `${idx} / ${this.frames.length}`,
        y: this.canvas.height - fsize,
        fontSize: fsize,
        fontFamily: "Arial",
        fontStyle: "normal",
        shadowColor: "black",
        shadowBlur: 1,
        fill: utils.color.toCss("green", this.$vuetify)
      };
    },

    $frames: function() {
      const ow = this.originSize.width;
      const oh = this.originSize.height;
      const cw = this.canvas.width;
      const ch = this.canvas.height;
      return this.frames.map(f => {
        return {
          id: f.id,
          idx: f.idx,
          time: f.time,
          // 表示対象の点群データ
          circles: f.points
            ? f.points.map(x => {
                return {
                  stroke: "white",
                  strokeWidth: 1,
                  x: ow ? (x.x * cw) / ow : x.x,
                  y: oh ? (x.y * ch) / oh : x.y,
                  radius: 3,
                  fill: utils.color.toCss(
                    x.color || this.defaultPointColor,
                    this.$vuetify
                  )
                };
              })
            : [],
          // 表示対象の矩形群データ
          rects: f.rects
            ? f.rects.map(x => {
                return {
                  x: ow ? (x.x * cw) / ow : x.x,
                  y: oh ? (x.y * ch) / oh : x.y,
                  width: ow ? (x.width * cw) / ow : x.width,
                  height: oh ? (x.height * ch) / oh : x.height,
                  rotation: x.rotation || 0,
                  scaleX: x.scaleX || 1,
                  scaleY: x.scaleY || 1,
                  strokeWidth: 2,
                  stroke: utils.color.toCss(
                    x.color || this.defaultRectColor,
                    this.$vuetify
                  )
                };
              })
            : [],
          // 表示対象のテキスト群データ
          texts: f.texts
            ? f.texts.map(x => {
                return {
                  x: ow ? (x.x * this.canvas.width) / ow : x.x,
                  y: oh ? (x.y * this.canvas.height) / oh : x.y,
                  text: x.text,
                  fontSize: x.size,
                  fontFamily: x.fontFamily || "Arial",
                  fontStyle: x.fontStyle || "normal",
                  shadowColor: "black",
                  shadowBlur: 1,
                  fill: utils.color.toCss(
                    x.color || this.defaultRectColor,
                    this.$vuetify
                  )
                };
              })
            : []
        };
      });
    }
  },
  methods: {
    // 動画再生速度を変更
    setPlaybackRate: function(val) {
      this.$refs.video.defaultPlaybackRate = val;
    },
    // ビデオ操作の再現
    play: function() {
      this.$refs.video.play();
    },
    pause: function() {
      this.$refs.video.pause();
    },
    setCurrentTime: function(time) {
      this.$refs.video.currentTime = time;
    },
    getCurrentTime: function() {
      if (this.$refs.video) return this.$refs.video.currentTime;
      return 0;
    },
    getDuration: function() {
      return this.$refs.video.duration;
    },
    downloadImage: async function() {
      let name = `time-${this.getCurrentTime()}.png`;
      if (this.frames.length > 0) {
        name = `frame-${this.frame.idx}.png`;
      }
      const dataURL = await this.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = name;
      link.click();
    },
    getVideoDataURL: function() {
      const video = this.$refs.video;
      if (video) {
        const canvas = document.createElement("canvas");
        canvas.width = this.originSize.width;
        canvas.height = this.originSize.height;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
      } else {
        return null;
      }
    },
    toDataURL: function() {
      return new Promise((resolve, reject) => {
        if (this.$refs.stage) {
          const stage = this.$refs.stage.getStage();
          const video = this.$refs.video;

          if (video) {
            const canvas = document.createElement("canvas");
            canvas.width = this.originSize.width;
            canvas.height = this.originSize.height;
            canvas
              .getContext("2d")
              .drawImage(video, 0, 0, canvas.width, canvas.height);

            const canvasDataURL = stage.toDataURL();
            const img = new Image();
            img.src = canvasDataURL;
            img.onload = () => {
              canvas
                .getContext("2d")
                .drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL());
            };
            img.onerror = e => reject(e);
          } else {
            reject(Error("No video"));
          }
        }
      });
    },
    // キャンバスサイズの変更
    setCanvasSize: function() {
      const video = this.$refs.video;
      if (video) {
        const width = this.$refs.video.clientWidth;
        const height = this.$refs.video.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;
      }
    },
    // キャンバス同期
    syncFrame: function(currentTime) {
      if (this.$frames.length > 0) {
        if (currentTime) {
          const frame = this.$vuewer.math.nearest(
            this.$frames,
            "time",
            currentTime
          );
          if (frame.time >= currentTime) {
            this.frame = frame;
            const i = this.frames.findIndex(x => x.id == frame.id);
            if (i !== -1) {
              this.$emit("frame-updated", this.frames[i]);
            }
          }
        }
      }
    },
    // 動画読み込み処理後の処理
    onLoaded: function() {
      this.setCanvasSize();
      if (this.$frames.length > 0) {
        this.frame = this.$frames[0];
      }
      this.$emit("loadeddata", this.$refs.video);
      this.show = false;
    },
    // ウインドウサイズ変更時
    onResize: function() {
      this.setCanvasSize();
    },
    onKeyup: function(payload) {
      this.$emit("keyup", payload);
    },
    // 動画時刻変更時の処理
    onTimeupdate: function() {
      const vm = this;
      setTimeout(() => {
        const currentTime = vm.getCurrentTime();
        vm.$emit("timeupdate", currentTime);
        vm.syncFrame(currentTime);
      });
    },
    onClickEvent: function(e, key) {
      const payload = {
        event: e,
        frame: this.frame,
        origin: this.originSize,
        canvas: this.canvas
      };
      this.$emit(key, payload);
    }
  }
};
</script>

<style scoped></style>
