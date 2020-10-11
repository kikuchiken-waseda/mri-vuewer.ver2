const color = "#F44336";
const mode = "circ";
export default {
  namespaced: true,
  state: () => ({
    mode: mode,
    filter: null,
    color: color,
    tab: null,
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
    tab: (state, int) => (state.tab = int),
    mode: (state, str) => (state.mode = str),
    filter: (state, func) => (state.filter = func),
    color: (state, str) => (state.color = str),
    src: (state, str) => (state.src = str),
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
    init: function(context) {
      context.state.tab = null;
      context.state.mode = mode;
      context.state.filter = null;
      context.state.color = color;
      context.state.src = null;
      context.state.id = null;
      context.state.idx = null;
      context.state.time = null;
      context.state.ow = null;
      context.state.oh = null;
      context.state.points = [];
      context.state.rects = [];
      context.state.texts = [];
    },
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
