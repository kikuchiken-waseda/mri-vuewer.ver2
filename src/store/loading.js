export default {
  namespaced: true,
  state: () => ({
    show: false,
    message: ""
  }),
  mutations: {
    show: function(state, payload) {
      state.show = payload;
      if (payload == false) {
        state.message = "";
      }
    },
    message: function(state, payload) {
      state.message = payload;
    }
  },
  actions: {
    start(context, payload) {
      context.commit("message", payload);
      context.commit("show", true);
    },
    finish(context) {
      context.commit("show", false);
    }
  }
};
