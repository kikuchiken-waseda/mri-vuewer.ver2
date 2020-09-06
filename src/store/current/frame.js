export default {
  namespaced: true,
  state: () => ({
    idx: null,
    time: null,
    source: null,
    width: null,
    height: null,
    points: [],
    rects: []
  }),
  mutations: {
    idx(state, payload) {
      state.idx = Math.round(Number(payload));
    },
    time(state, payload) {
      state.time = Number(payload);
    },
    source(state, payload) {
      state.source = payload;
    },
    width(state, payload) {
      state.width = payload;
    },
    height(state, payload) {
      state.height = payload;
    },
    points(state, payload) {
      state.points = payload;
    },
    pushPoint(state, payload) {
      const item = {
        id: state.points.length,
        x: payload.x,
        y: payload.y,
        size: payload.size,
        color: payload.color
      };
      state.points.push(item);
    },
    rects(state, payload) {
      state.rects = payload;
    },
    pushRect(state, payload) {
      const item = {
        id: state.rects.length,
        x: payload.x,
        y: payload.y,
        width: payload.width,
        height: payload.height,
        rotation: payload.rotation,
        size: payload.size,
        color: payload.color
      };
      state.rects.push(item);
    }
  },
  actions: {}
};
