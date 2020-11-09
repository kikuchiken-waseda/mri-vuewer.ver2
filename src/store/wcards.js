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
      if (payload._uid) {
        const idx = state.closings.findIndex(x => x._uid == payload._uid);
        if (idx == -1) state.closings.push(payload);
      } else {
        const idx = state.closings.findIndex(x => x.title == payload);
        if (idx == -1) state.closings.push(payload);
      }
    },
    open(state, payload) {
      if (payload._uid) {
        const idx = state.closings.findIndex(x => x._uid == payload._uid);
        if (idx > -1) state.closings.splice(idx, 1);
      } else {
        const idx = state.closings.findIndex(x => x.title == payload);
        if (idx > -1) state.closings.splice(idx, 1);
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
          if (cards[i].setZIndex) cards[i].setZIndex(1);
        }
      }
    }
  }
};
