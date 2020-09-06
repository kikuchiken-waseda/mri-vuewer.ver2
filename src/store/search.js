export default {
  namespaced: true,
  state: () => ({
    keyword: "",
    show: false
  }),
  mutations: {
    keyword: function(state, payload) {
      state.keyword = payload;
    },
    show: function(state, payload) {
      state.show = payload;
    }
  },
  actions: {
    init: function(context) {
      context.commit("show", false);
      context.commit("keyword", "");
    },
    show: function(context) {
      context.commit("show", true);
      context.commit("keyword", "");
    }
  }
};
