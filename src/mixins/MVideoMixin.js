export default {
  computed: {
    videoName: {
      get() {
        return this.$store.state.current.video.filename;
      }
    },
    videoSource: {
      get() {
        return this.$store.state.current.video.source;
      }
    },
    fps: {
      get() {
        return this.$store.state.current.video.fps;
      }
    },
    duration: {
      get() {
        return this.$store.state.current.video.duration;
      }
    },
    videoStream: {
      get() {
        return this.$store.state.current.video.videoStream;
      }
    },
    audioStream: {
      get() {
        return this.$store.state.current.video.audioStream;
      }
    },
    originSize: {
      get() {
        return this.$store.state.current.video.originSize;
      }
    }
  }
};
