export default {
  namespaced: true,
  state: () => ({
    src: null,
    id: null,
    idx: null,
    time: null,
    ow: null,
    oh: null,
    points: [],
    rects: [],
    texts: []
  }),
  mutations: {
    src(state, payload) {
      state.src = payload;
    },
    id(state, payload) {
      const id = Number(payload);
      state.id = Math.round(id);
    },
    idx(state, payload) {
      state.idx = Math.round(Number(payload));
    },
    time(state, payload) {
      state.time = Number(payload);
    },
    ow(state, payload) {
      state.ow = payload;
    },
    oh(state, payload) {
      state.oh = payload;
    },
    points(state, payload) {
      state.points = payload;
    },
    rects(state, payload) {
      state.rects = payload;
    },
    texts(state, payload) {
      state.texts = payload;
    },
    pushPoint(state, payload) {
      const item = {
        id: payload.id || state.points.length,
        x: payload.x,
        y: payload.y,
        size: payload.size,
        color: payload.color,
        frameId: payload.frameId
      };
      state.points.push(item);
    },
    pushRect(state, payload) {
      const item = {
        id: payload.id || state.rects.length,
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
  actions: {
    frame: function(context, payload) {
      context.commit("src", payload.src || context.state.src);
      context.commit("idx", payload.idx || context.state.idx);
      context.commit("id", payload.id || context.state.id);
      context.commit("time", payload.time || context.state.time);
      context.commit("points", payload.points || context.state.points);
      context.commit("rects", payload.rects || context.state.rects);
      context.commit("texts", payload.texts || context.state.texts);
    }
  }
};
