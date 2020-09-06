export default {
  namespaced: true,
  state: () => ({
    cards: [],
    closings: []
  }),
  mutations: {
    setCard(state, payload) {
      state.cards.push(payload);
    },
    closing(state, payload) {
      const idx = state.closings.findIndex(x => x._uid == payload._uid);
      if (idx == -1) {
        state.closings.push(payload);
      }
    },
    open(state, payload) {
      const idx = state.closings.findIndex(x => x._uid == payload._uid);
      if (idx > -1) {
        state.closings.splice(idx, 1);
      }
    }
  },
  actions: {
    init(context) {
      context.state.cards = [];
      context.state.closings = [];
    },
    setZIndex(context, payload) {
      const cards = context.state.cards;
      const card = cards[payload.id];
      card.setZIndex(payload.zIndex + cards.length);
      for (const i in cards) {
        if (i != payload.id) {
          cards[i].setZIndex(1);
        }
      }
    }
  }
};
