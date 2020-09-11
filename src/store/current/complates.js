import Vue from "vue";
export default {
  namespaced: true,
  state: () => ({
    complates: {}
  }),
  mutations: {
    complates(state, payload) {
      for (const key in payload) {
        Vue.set(state.complates, key, payload[key]);
      }
    }
  },
  actions: {
    init: function(context) {
      context.state.complates = {};
    },
    updateAutocompletes: function(context, payload) {
      context.state.completes = Object.assign(context.state.completes, payload);
    },
    deleteAutocompletes: function(context, key) {
      Vue.delete(context.state.complates, key);
    }
  },
  getters: {
    keys: function(state) {
      const keys = Object.keys(state.complates);
      return keys;
    },
    list: function(state) {
      return state.complates;
    }
  }
};
