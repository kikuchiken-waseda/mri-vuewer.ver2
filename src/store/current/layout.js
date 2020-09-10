export default {
  namespaced: true,
  state: () => ({
    mini: false,
    videoCols: 6,
    textgridCols: 6
  }),
  mutations: {
    mini(state, payload) {
      state.mini = payload;
    },
    videoCols(state, payload) {
      state.videoCols = Number(payload);
    },
    textgridCols(state, payload) {
      state.textgridCols = Number(payload);
    }
  },
  actions: {
    init: function(context) {
      context.state.mini = false;
      context.state.videoCols = 6;
      context.state.textgridCols = 6;
    },
    videoCols(context, payload) {
      const $val = Number(payload);
      const val = $val < 0 ? 0 : $val > 12 ? 12 : $val;
      context.state.videoCols = val;
      context.state.textgridCols = 12 - val;
      context.state.mini = val == 12 ? true : false;
    }
  }
};
