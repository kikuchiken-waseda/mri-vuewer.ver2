export default {
  computed: {
    frameSource: {
      get() {
        return this.$store.state.current.frame.source;
      },
      set(val) {
        this.$store.commit("current/frame/setSource", val);
      }
    },
    frameIdx: {
      get() {
        return this.$store.state.current.frame.idx;
      },
      set(val) {
        this.$store.commit("current/frame/setIdx", Math.round(Number(val)));
      }
    },
    frameTime: {
      get() {
        return this.$store.state.current.frame.time;
      },
      set(val) {
        this.$store.commit("current/frame/setTime", Number(val));
      }
    }
  }
};
