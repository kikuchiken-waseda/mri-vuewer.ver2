import util from "@/utils/text.js";

export default {
  namespaced: true,
  state: () => ({
    input: "",
    keyword: "",
    params: "",
    query: {},
    show: false
  }),
  mutations: {
    input: function(state, payload) {
      state.input = payload;
      state.keyword = util.trim(payload);
      state.params = util.toParam(payload);
      state.query = util.toQuery(state.params);
    },
    params: function(state, payload) {
      state.params = util.toParam(payload);
      state.query = util.toQuery(state.params);
    },
    show: function(state, payload) {
      state.show = payload;
    }
  },
  actions: {
    init: function(context) {
      context.state.input = "";
      context.state.keyword = "";
      context.state.params = "";
      context.state.query = {};
      context.state.show = false;
    },
    show: function(context) {
      context.commit("show", true);
      context.commit("input", "");
    }
  },
  getters: {
    args: function(state) {
      return Object.keys(state.query).filter(x => state.query[x] === true);
    },
    norargs: function(state) {
      const keys = Object.keys(state.query).filter(
        x => ~x.indexOf("!") && state.query[x] !== true
      );
      return keys.reduce(
        (obj, k) => ({ ...obj, [k.replace("!", "")]: state.query[k] }),
        {}
      );
    },
    kwargs: function(state) {
      const keys = Object.keys(state.query).filter(
        x => !~x.indexOf("!") && state.query[x] !== true
      );
      return keys.reduce((obj, k) => ({ ...obj, [k]: state.query[k] }), {});
    }
  }
};
