export default {
  namespaced: true,
  state: () => ({
    logs: []
  }),
  mutations: {
    log: function(state, payload) {
      const item = {
        time: Date.now(),
        msg: payload.msg
      };
      state.logs.push(item);
    },
    error: function(state, payload) {
      const item = {
        time: Date.now(),
        msg: payload.msg,
        error: payload.error
      };
      state.logs.push(item);
    }
  }
};
