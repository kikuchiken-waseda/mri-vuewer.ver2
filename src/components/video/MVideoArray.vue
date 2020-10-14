<template>
  <m-video-array-layout>
    <template v-slot:prev>
      <m-video
        muted
        flat
        ref="prev"
        :style="videoStyle"
        :src="src"
        :frames="$frames"
        :origin-size="$originSize"
        @keyup="onKeyup('prev', $event)"
        @mouseover="$emit('mouseover')"
      />
    </template>
    <m-video
      flat
      ref="video"
      v-resize="onResize"
      @loadeddata="onLoadeddata"
      @timeupdate="onTimeupdate"
      @frame-updated="onFrameUpdated"
      :origin-size="$originSize"
      :style="videoStyle"
      :src="src"
      :frames="$frames"
      @keyup="onKeyup('prev', $event)"
      @mouseover="$emit('mouseover')"
    />
    <template v-slot:next>
      <m-video
        flat
        muted
        ref="next"
        :src="src"
        :origin-size="$originSize"
        :style="videoStyle"
        :frames="$frames"
        @keyup="onKeyup('prev', $event)"
        @mouseover="$emit('mouseover')"
      />
    </template>
  </m-video-array-layout>
</template>

<script>
import MVideoArrayLayout from "@/components/layouts/MVideoArrayLayout.vue";
import MVideo from "@/components/video/MVideo.vue";
export default {
  name: "WVideo",
  components: { MVideoArrayLayout, MVideo },
  props: {
    src: {
      type: String,
      required: true
    },
    // どの程度前後をずらすか?
    frameOffset: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    el: null,
    systemBarClass: "caption text-truncate",
    videoStyle: {
      width: "100%",
      height: "auto"
    }
  }),
  computed: {
    $originSize: function() {
      return this.$store.state.current.originSize;
    },
    $frameRate: function() {
      return this.$store.state.current.frameRate;
    },
    $frames: function() {
      return this.$store.state.current.frames;
    }
  },
  methods: {
    t: function(key) {
      return this.$vuetify.lang.t(`$vuetify.wVideo.${key}`);
    },
    focus: function() {
      this.$refs.video.focus();
    },
    setPlaybackRate: function(val) {
      this.$refs.video.setPlaybackRate(val);
    },
    syncVideos: function(currentTime) {
      if (this.$refs.video) {
        const offsetTime = this.frameOffset * this.$frameRate;
        if (currentTime - offsetTime > 0) {
          const time = currentTime - offsetTime;
          this.$refs.prev.setCurrentTime(time);
        }
        if (offsetTime + currentTime < this.getDuration()) {
          const time = currentTime + offsetTime;
          this.$refs.next.setCurrentTime(time);
        }
      }
    },
    onFrameUpdated: function(payload) {
      console.log("onFrameUpdated");
      const video = this.$refs.video;
      if (video) {
        const dataURL = video.getVideoDataURL();
        if (payload) {
          payload.src = dataURL;
          this.$store.dispatch("current/frame/frame", payload);
          this.$emit("frame-updated", payload);
        }
      }
    },
    getDuration: function() {
      if (this.$refs.video) {
        return this.$refs.video.getDuration();
      }
    },
    getCurrentTime: function() {
      if (this.$refs.video) {
        return this.$refs.video.getCurrentTime();
      }
    },
    // イベント発火
    onKeyup(ref, event) {
      const payload = { ref, event };
      this.$emit("keyup", payload);
    },
    onLoadeddata(elm) {
      // 完全に 0 にすると画像取得ができない
      this.$refs.video.setCurrentTime(0);
      this.$emit("loadeddata", elm);
    },
    onTimeupdate: function(time) {
      this.$emit("timeupdate", time);
      this.syncVideos(time);
    },
    onResize: function() {
      this.$emit("resize");
    },
    downloadImage: function() {
      this.$refs.video.downloadImage();
    }
  }
};
</script>
