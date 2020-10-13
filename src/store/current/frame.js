import Vue from "vue";
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
    activeStyle: { size: 7 },
    style: { size: 5 },
    points: [],
    rects: [],
    texts: []
  }),
  mutations: {
    tab: (state, idx) => {
      state.tab = Math.round(Number(idx));
      if (idx == 0) {
        state.mode = "circ";
      } else if (idx == 1) {
        state.mode = "rect";
      }
    },
    mode: (state, str) => {
      state.mode = str;
      if (str == "circ") {
        state.tab = 0;
      } else if (str == "rect") {
        state.tab = 1;
      }
    },
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
      if (payload.idx && payload.src) {
        context.commit("src", payload.src || context.state.src);
        context.commit("idx", payload.idx || context.state.idx);
        context.commit("id", payload.id || context.state.id);
        context.commit("time", payload.time || context.state.time);
        context.commit("points", payload.points || context.state.points);
        context.commit("rects", payload.rects || context.state.rects);
        context.commit("texts", payload.texts || context.state.texts);
      }
    },
    addPoint({ state, dispatch }, item) {
      item.x = (item.x / state.cw) * state.ow;
      item.y = (item.y / state.ch) * state.oh;
      item.size = state.style.size;
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
    },
    updatePoint({ state, dispatch }, item) {
      if (item.id) {
        const i = state.points.findIndex(p => p.id == item.id);
        if (i !== -1) {
          const origin = state.points[i];
          item.x = (item.x / state.cw) * state.ow || origin.x;
          item.y = (item.y / state.ch) * state.oh || origin.y;
          item.color = item.color || origin.color;
          item.label = item.label || origin.label;
          item.size = state.style.size;
          item.frameId = state.id;
          Vue.set(state.points, i, item);
          db.points
            .put(item)
            .then(() => {
              const frame = { id: state.id, points: state.points };
              dispatch("current/updateFrames", frame, { root: true });
            })
            .catch(error => {
              dispatch("snackbar/error", error.message, { root: true });
            });
        }
      }
    },
    deletePoint({ state, dispatch }, pk) {
      const i = state.points.findIndex(p => p.id == pk);
      if (i != -1) {
        db.points
          .delete(pk)
          .then(() => {
            state.points.splice(i, 1);
            const frame = { id: state.id, points: state.points };
            dispatch("current/updateFrames", frame, { root: true });
          })
          .catch(error => {
            dispatch("snackbar/error", error.message, { root: true });
          });
      }
    },
    activePoint({ state }, pk) {
      const i = state.points.findIndex(p => p.id == pk);
      if (i != -1) {
        const active = Object.assign(state.points[i], state.activeStyle);
        Vue.set(state.points, i, active);
      }
    },
    inactivePoint({ state }, pk) {
      const i = state.points.findIndex(p => p.id == pk);
      if (i != -1) {
        const active = Object.assign(state.points[i], state.style);
        Vue.set(state.points, i, active);
      }
    },
    addRect({ state, dispatch }, item) {
      item.x = (item.x / state.cw) * state.ow;
      item.y = (item.y / state.ch) * state.oh;
      item.width = (item.width / state.cw) * state.ow;
      item.height = (item.height / state.ch) * state.oh;
      item.size = state.style.size;
      item.frameId = state.id;
      db.rects
        .put(item)
        .then(id => {
          item.id = id;
          state.rects.push(item);
          const frame = { id: state.id, rects: state.rects };
          dispatch("current/updateFrames", frame, { root: true });
        })
        .catch(error => {
          dispatch("snackbar/error", error.message, { root: true });
        });
    },
    updateRect({ state, dispatch }, item) {
      if (item.id) {
        const i = state.rects.findIndex(r => r.id == item.id);
        if (i !== -1) {
          item.x = (item.x / state.cw) * state.ow;
          item.y = (item.y / state.ch) * state.oh;
          item.width = (item.width / state.cw) * state.ow;
          item.height = (item.height / state.ch) * state.oh;
          item.size = state.style.size;
          item.frameId = state.id;
          Vue.set(state.rects, i, item);
          db.rects
            .put(item)
            .then(() => {
              const frame = { id: state.id, rects: state.rects };
              dispatch("current/updateFrames", frame, { root: true });
            })
            .catch(error => {
              dispatch("snackbar/error", error.message, { root: true });
            });
        }
      }
    },
    deleteRect({ state, dispatch }, pk) {
      const i = state.rects.findIndex(r => r.id == pk);
      if (i != -1) {
        db.rects
          .delete(pk)
          .then(() => {
            state.rects.splice(i, 1);
            const frame = { id: state.id, rects: state.rects };
            dispatch("current/updateFrames", frame, { root: true });
          })
          .catch(error => {
            dispatch("snackbar/error", error.message, { root: true });
          });
      }
    },
    activeRect({ state }, pk) {
      const i = state.rects.findIndex(r => r.id == pk);
      if (i != -1) {
        const active = Object.assign(state.rects[i], state.activeStyle);
        Vue.set(state.rects, i, active);
      }
    },
    inactiveRect({ state }, pk) {
      const i = state.rects.findIndex(p => p.id == pk);
      if (i != -1) {
        const active = Object.assign(state.rects[i], state.style);
        Vue.set(state.rects, i, active);
      }
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
