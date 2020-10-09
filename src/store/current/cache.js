export default {
  namespaced: true,
  state: () => ({
    textgrids: []
  }),
  mutations: {
    textgrids(state, payload) {
      state.textgrids = payload;
    }
  },
  actions: {
    init: function(context) {
      context.commit("textgrids", []);
    },
    setTextgrid(context, payload) {
      const $payload = JSON.stringify(payload);
      const tgs = context.state.textgrids;
      if (tgs.length > 0) {
        const prev = tgs[tgs.length - 1];
        if (prev != $payload) {
          context.state.textgrids.push($payload);
        }
      } else {
        context.state.textgrids.push($payload);
      }
    }
  },
  getters: {
    textgrids: state => (idx = 0) => {
      const _idx = state.textgrids.length - idx - 1;
      if (_idx > -1) {
        const data = state.textgrids[_idx];
        state.textgrids.splice(_idx);
        return JSON.parse(data);
      }
      return null;
    }
  }
};
