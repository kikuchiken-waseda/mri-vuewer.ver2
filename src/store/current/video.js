export default {
  namespaced: true,
  state: () => ({
    filename: null,
    source: null,
    fps: null,
    duration: null,
    videoStream: null,
    audioStream: null,
    originSize: {
      width: null,
      height: null
    }
  }),
  mutations: {
    fileName: (state, payload) => (state.filename = payload),
    source: (state, payload) => (state.source = payload),
    fps: (state, payload) => (state.fps = payload),
    duration: (state, payload) => (state.duration = payload),
    videoStream: (state, payload) => (state.videoStream = payload),
    audioStream: (state, payload) => (state.audioStream = payload),
    originSize(state, payload) {
      if (payload.width) state.originSize.width = payload.width;
      if (payload.height) state.originSize.height = payload.height;
    }
  },
  actions: {
    init: function(context) {
      context.commit("fileName", null);
      context.commit("source", null);
      context.commit("fps", null);
      context.commit("duration", null);
      context.commit("videoStream", null);
      context.commit("audioStream", null);
      context.commit("audioStream", null);
      context.commit("originSize", { width: null, height: null });
    }
  },
  getters: {
    bname: function(state) {
      if (state.filename) {
        return state.filename.split(".")[0];
      }
      return null;
    },
    dropboxPath: function(state) {
      if (state.filename) {
        return `/data/${state.filename.split(".")[0]}.json`;
      }
      return null;
    }
  }
};
