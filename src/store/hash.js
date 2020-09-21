import Vue from "vue";
export default {
  namespaced: true,
  state: () => ({
    text: "",
    info: {}
  }),
  mutations: {
    text: function(state, payload) {
      state.text = payload;
    },
    info: function(state, payload) {
      state.info = payload;
    }
  },
  actions: {
    text(context, text) {
      const $text = text.replace("#", "");
      context.commit("text", $text);
      for (const line of $text.split("&")) {
        const items = line.split("=");
        if (items.length == 1) {
          Vue.set(context.state.info, items[0], true);
        } else {
          Vue.set(context.state.info, items[0], items[1]);
        }
      }
    }
  }
};
