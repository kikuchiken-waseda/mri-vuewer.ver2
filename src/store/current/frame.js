import db from "@/storage/db";

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
    id: null, // frame-id
    idx: null, // frame-idx
    time: null, // frame-time
    ow: null, // オリジナル画像サイズ
    oh: null, // オリジナル画像サイズ
    cw: 700, // フレームダイアログのキャンバスサイズ (width)
    ch: 700, // フレームダイアログのキャンバスサイズ (height)
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
    id: (state, payload) => (state.id = Math.round(Number(payload))),
    idx: (state, payload) => (state.idx = Math.round(Number(payload))),
    time: (state, payload) => (state.time = Number(payload)),
    cw: (state, payload) => (state.cw = Number(payload)),
    ch: (state, payload) => (state.ch = Number(payload)),
    ow: (state, payload) => (state.ow = Number(payload)),
    oh: (state, payload) => (state.oh = Number(payload)),
    points(state, payload) {
      state.points = payload;
    },
    rects(state, payload) {
      state.rects = payload;
    },
    texts(state, payload) {
      state.texts = payload;
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
    },
    addPoint({ state, dispatch }, item) {
      item.x = (item.x / state.cw) * state.ow;
      item.y = (item.y / state.ch) * state.oh;
      item.frameId = state.id;
      db.points
        .put(item)
        .then(id => {
          item.id = id;
          state.points.push(item);
          const frame = { id: state.id, points: state.points };
          dispatch("current/updateFrames", frame, { root: true });
        })
        .catch(error => {
          dispatch("snackbar/error", error.message, { root: true });
        });
    }
  },
  getters: {
    rects: function(state) {
      const rects =
        state.rects.filter(r => r.x && r.y && r.width && r.height) || [];
      return rects.map(r => {
        return {
          id: r.id || rects.length,
          name: `rect-${r.id || rects.length}`,
          label: r.label || `rect-${r.id}`,
          x: (r.x * state.cw) / state.ow,
          y: (r.y * state.ch) / state.oh,
          width: (r.width * state.cw) / state.ow,
          height: (r.height * state.ch) / state.oh,
          rotation: r.rotation || 1,
          scaleX: r.scaleX || 1,
          scaleY: r.scaleY || 1,
          size: r.size,
          color: r.color
        };
      });
    },
    points: function(state) {
      const points = state.points.filter(p => p.x && p.y) || [];
      return points.map(p => {
        return {
          id: p.id,
          x: (p.x * state.cw) / state.ow,
          y: (p.y * state.ch) / state.oh,
          label: p.label || `point-${p.id}`,
          size: p.size,
          color: p.color
        };
      });
    }
  }
};
