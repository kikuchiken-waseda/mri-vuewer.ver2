import Vue from "vue";
import db from "@/storage/db";
import cv from "@/utils/image";

const color = "#F44336";
const mode = "circ";
export default {
  namespaced: true,
  state: () => ({
    modes: [
      { val: "circ", icon: "mdi-shape-circle-plus" },
      { val: "rect", icon: "mdi-shape-rectangle-plus" },
      { val: "ruler", icon: "mdi-ruler-square" },
      { val: "polygon", icon: "mdi-shape-polygon-plus" },
      // { val: "pen", icon: "mdi-pencil-plus" },
      { val: "eras", icon: "mdi-eraser" }
    ],
    filters: [
      {
        func: async (src, originSize) =>
          await cv.otsuThreshold(src, originSize),
        name: "$vuetify.iFilter.threshold"
      },
      {
        func: async (src, originSize) =>
          await cv.adaptiveThreshold(src, originSize),
        name: "$vuetify.iFilter.adaptiveThreshold"
      },
      {
        func: async (src, originSize) =>
          await cv.canny(src, originSize),
        name: "$vuetify.iFilter.canny"
      },
      {
        func: async (src, originSize) =>
          await cv.bilateralFilter(src, originSize),
        name: "$vuetify.iFilter.bilateral"
      },
      {
        func: async (src, originSize) =>
          await cv.laplacianFilter(src, originSize),
        name: "$vuetify.iFilter.laplacian"
      }
    ],
    mode: mode,
    filter: null,
    tab: null,
    color: color,
    src: null,
    prev: null,
    next: null,
    isChange: false,
    isChangePrev: false,
    isChangeNext: false,
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
    polygons: [],
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
    filter: (state, name) => {
      const idx = state.filters.findIndex(f => f.name == name);
      state.filter = idx == -1 ? null : state.filters[idx];
    },
    color: (state, str) => (state.color = str),
    src: (state, str) => (state.src = str),
    prev: (state, str) => (state.prev = str),
    next: (state, str) => (state.next = str),
    isChange: (state, bool) => {
      state.isChange = bool;
      if (bool === true) {
        state.isChangePrev = false;
        state.isChangeNext = false;
      }
    },
    isChangePrev: (state, bool) => {
      state.isChangePrev = bool;
      if (state.isChangeNext === false) {
        state.isChange = false;
      }
    },
    isChangeNext: (state, bool) => {
      state.isChangeNext = bool;
      if (state.isChangePrev === false) {
        state.isChange = false;
      }
    },
    id: (state, payload) => (state.id = Math.round(Number(payload))),
    idx: (state, payload) =>
      (state.idx = Math.round(Number(payload))),
    time: (state, payload) => (state.time = Number(payload)),
    cw: (state, val) => {
      console.log(val);
      state.cw = Number(val) > 0 ? Number(val) : 700;
    },
    ch: (state, val) => {
      console.log(val);
      state.ch = Number(val) > 0 ? Number(val) : 700;
    },
    ow: (state, payload) => (state.ow = Number(payload)),
    oh: (state, payload) => (state.oh = Number(payload)),
    points(state, points) {
      state.points = points;
    },
    polygons(state, polygons) {
      state.polygons = polygons;
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
      context.state.polygons = [];
    },
    frame: function(context, payload) {
      // 現在動画が変更された際に呼び出される関数
      if (payload.idx && payload.src) {
        context.commit("isChange", true);
        context.commit("src", payload.src || context.state.src);
        context.commit("idx", payload.idx || context.state.idx);
        context.commit("id", payload.id || context.state.id);
        context.commit("time", payload.time || context.state.time);

        context.commit(
          "points",
          payload.points || context.state.points
        );

        context.commit(
          "polygons",
          payload.polygons || context.state.polygons
        );
        context.commit("rects", payload.rects || context.state.rects);
        context.commit("texts", payload.texts || context.state.texts);
      }
    },
    async addPolygon({ state, dispatch }, polygon) {
      const points = polygon.points.map(item => {
        const x = (item.x / state.cw) * state.ow;
        const y = (item.y / state.ch) * state.oh;
        return { x, y, id: item.id };
      });
      const item = {
        frameId: state.id,
        label: polygon.label,
        color: polygon.color,
        points: points,
        size: state.style.size
      };
      try {
        item.id = await db.polygons.put(item);
        state.polygons.push(item);
        const frame = { id: state.id, polygons: state.polygons };
        dispatch("current/updateFrames", frame, { root: true });
      } catch (error) {
        dispatch("snackbar/error", error.message, { root: true });
      }
    },
    async updatePolygon({ state, commit, dispatch }, payload) {
      const item = { ...payload };
      try {
        await db.polygons.put(item);
        const newPolygons = state.polygons.map(x => {
          if (x.id === payload.id) return item;
          return x;
        });
        const frame = { id: state.id, polygons: newPolygons };
        dispatch("current/updateFrames", frame, { root: true });
        commit("polygons", newPolygons);
      } catch (error) {
        dispatch("snackbar/error", error.message, { root: true });
      }
    },
    async deletePolygon({ state, dispatch }, payload) {
      const { polygon_id } = payload;
      const i = state.polygons.findIndex(x => x.id == polygon_id);
      if (i != -1) {
        try {
          await db.polygons.delete(polygon_id);
          state.polygons.splice(i, 1);
        } catch (error) {
          dispatch("snackbar/error", error.message, { root: true });
        }
      }
    },
    activePolygonPoint({ state }, pyload) {
      const { polygon_id, point_id, mode } = pyload;
      const i = state.polygons.findIndex(x => x.id == polygon_id);
      if (i != -1) {
        const points = state.polygons[i].points.map(x => {
          return x.id == point_id
            ? Object.assign(x, state.activeStyle)
            : x;
        });
        if (mode == "eras") {
          const active = Object.assign(state.polygons[i], {
            points,
            ...state.activeStyle
          });
          Vue.set(state.polygons, i, active);
        } else {
          const active = Object.assign(state.polygons[i], { points });
          Vue.set(state.polygons, i, active);
        }
      }
    },
    inactivePolygonPoint({ state }, payload) {
      const { polygon_id, point_id, mode } = payload;
      const i = state.polygons.findIndex(x => x.id == polygon_id);
      if (i != -1) {
        const points = state.polygons[i].points.map(x => {
          return x.id == point_id ? Object.assign(x, state.style) : x;
        });
        if (mode == "eras") {
          const active = Object.assign(state.polygons[i], {
            points,
            ...state.style
          });
          Vue.set(state.polygons, i, active);
        } else {
          const active = Object.assign(state.polygons[i], { points });
          Vue.set(state.polygons, i, active);
        }
      }
    },
    async addPoint({ state, dispatch }, item) {
      item.x = (item.x / state.cw) * state.ow;
      item.y = (item.y / state.ch) * state.oh;
      item.size = state.style.size;
      item.frameId = state.id;
      try {
        item.id = await db.points.put(item);
        state.points.push(item);
        const frame = { id: state.id, points: state.points };
        dispatch("current/updateFrames", frame, { root: true });
      } catch (error) {
        dispatch("snackbar/error", error.message, { root: true });
      }
    },
    async addPoints({ state, dispatch }, points) {
      const $points = points.map(p => {
        return {
          x: p.x,
          y: p.y,
          color: p.color,
          label: p.label,
          size: state.style.size,
          frameId: state.id
        };
      });
      try {
        await db.points.bulkPut($points);
        state.points = await db.points
          .where({ frameId: state.id })
          .toArray();
        const frame = { id: state.id, points: state.points };
        dispatch("current/updateFrames", frame, { root: true });
      } catch (error) {
        dispatch("snackbar/error", error.message, { root: true });
      }
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
              dispatch("snackbar/error", error.message, {
                root: true
              });
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
        const active = Object.assign(
          state.points[i],
          state.activeStyle
        );
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
    async addRect({ state, dispatch }, item) {
      item.x = (item.x / state.cw) * state.ow;
      item.y = (item.y / state.ch) * state.oh;
      item.width = (item.width / state.cw) * state.ow;
      item.height = (item.height / state.ch) * state.oh;
      item.size = state.style.size;
      item.frameId = state.id;
      try {
        item.id = db.rects.put(item);
        state.rects.push(item);
        const frame = { id: state.id, rects: state.rects };
        dispatch("current/updateFrames", frame, { root: true });
      } catch (error) {
        dispatch("snackbar/error", error.message, { root: true });
      }
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
              dispatch("snackbar/error", error.message, {
                root: true
              });
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
        const active = Object.assign(
          state.rects[i],
          state.activeStyle
        );
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
        state.rects.filter(r => r.x && r.y && r.width && r.height) ||
        [];
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
      const points =
        state.points.filter(p => p.id && p.x && p.y) || [];
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
    },
    polygons: function(state) {
      const polygons = state.polygons.filter(p => p.id) || [];
      return polygons.map(_polygon => {
        const points = _polygon.points.map(p => {
          return {
            ...p,
            x: (p.x * state.cw) / state.ow,
            y: (p.y * state.ch) / state.oh
          };
        });
        const lines = points.slice(1).map((f2, id) => {
          const f1 = points[id];
          const line_points = [f1.x, f1.y, f2.x, f2.y];
          return { id: `line-${id}`, points: line_points };
        });
        return {
          ..._polygon,
          points: points,
          lines: lines
        };
      });
    }
  }
};
