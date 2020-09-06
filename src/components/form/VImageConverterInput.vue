<template>
  <div>
    <m-video-input @loading="onLoading" @loaded="onLoaded" />
    <video
      v-show="false"
      ref="video"
      :src="video.source"
      @loadeddata="next"
      @timeupdate="saveFrame"
    />
    <canvas v-show="false" ref="canvas" :style="canvasStyle" />
  </div>
</template>
<script>
import MVideoInput from "@/components/form/MVideoInput";
export default {
  name: "v-image-converter-input",
  components: { MVideoInput },
  data: () => ({
    video: {},
    step: 0,
    frameNum: 0,
    frames: []
  }),
  computed: {
    canvasStyle: function() {
      if (this.video.originSize) {
        return {
          width: `${this.video.originSize.width}px`,
          height: `${this.video.originSize.height}px`
        };
      } else {
        return {
          width: "0px",
          height: "0px"
        };
      }
    }
  },
  methods: {
    onLoading: function() {
      this.$emit("loading-file-info");
    },
    onLoaded: function(payload) {
      this.$emit("loaded-file-info");
      this.step = 0;
      this.frames = [];
      if (payload) {
        this.video = payload;
        this.frameNum = Math.floor(this.video.duration * this.video.fps);
        this.$emit("loading-frames", { step: 0, total: this.frameNum });
      } else {
        this.frameNum = 0;
        this.video = {};
      }
    },
    next: function() {
      const frameRate = 1 / this.video.fps;
      const currentTime = this.$refs.video.currentTime || 0;
      const nextTime = currentTime + frameRate;
      if (nextTime < this.video.duration) {
        this.step++;
        this.$emit("loading-frames", { step: this.step, total: this.frameNum });
        this.$refs.video.currentTime = nextTime;
      } else {
        this.$emit("loaded-frames", this.frames);
      }
    },
    saveFrame: function() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      canvas.width = this.video.originSize.width;
      canvas.height = this.video.originSize.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      this.frames.push({
        src: canvas.toDataURL(),
        step: this.step,
        time: this.$refs.video.currentTime
      });
      this.next();
    }
  }
};
</script>
<style scoped></style>
