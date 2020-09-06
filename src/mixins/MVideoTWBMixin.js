export default {
  computed: {
    $name: {
      get() {
        return this.$store.state.current.video.filename;
      },
      set(val) {
        this.$store.commit("current/video/fileName", val);
      }
    },
    $source: {
      get() {
        return this.$store.state.current.video.source;
      },
      set(val) {
        this.$store.commit("current/video/source", val);
      }
    },
    $fps: {
      get() {
        return this.$store.state.current.video.fps;
      },
      set(val) {
        this.$store.commit("current/video/fps", val);
      }
    },
    $duration: {
      get() {
        return this.$store.state.current.video.duration;
      },
      set(val) {
        this.$store.commit("current/video/duration", val);
      }
    },
    $videoStream: {
      get() {
        return this.$store.state.current.video.videoStream;
      },
      set(val) {
        this.$store.commit("current/video/videoStream", val);
      }
    },
    $audioStream: {
      get() {
        return this.$store.state.current.video.audioStream;
      },
      set(val) {
        this.$store.commit("current/video/audioStream", val);
      }
    },
    $originSize: {
      get() {
        return this.$store.state.current.video.originSize;
      },
      set(val) {
        this.$store.commit("current/video/originSize", val);
      }
    }
  },
  methods: {
    $initVideo: function() {
      this.$store.dispatch("current/video/init");
    }
  }
};
