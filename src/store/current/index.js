import Vue from "vue";
import video from "./video.js";
import frame from "./frame.js";
import layout from "./layout.js";
import cache from "./cache.js";
import complates from "./complates.js";
import frameConf from "./frameConf.js";

import db from "@/storage/db";

export default {
  namespaced: true,
  state: () => ({
    id: "",
    name: "", // 動画名
    wavesurfer: null, // 動画アノテーション用コンポーネント
    source: null, // 解析対象の動画 (base64) 形式
    fps: 0, // 解析対象動画 fps
    frameRate: 0, // 解析対象動画 1/fps
    textgrid: {}, // 時系列アノテーション結果
    metaData: {}, // 解析対象動画メタ情報
    item: {}, // DB から検索されたファイルデータ
    frames: [], // フレームアノテーション結果保存用リスト
    duration: 0,
    videoStream: {},
    audioStream: {},
    originSize: { height: 0, width: 0 },
    tab: 0 // アノテーション結果表示用テーブルタブ状態
  }),
  mutations: {
    item: (state, payload) => (state.item = payload),
    waveSurfer: (state, payload) => (state.wavesurfer = payload),
    source: (state, payload) => (state.source = payload),
    duration: (state, payload) => (state.duration = Number(payload)),
    tab: (state, payload) => (state.tab = payload),
    metaData: (state, payload) => (state.metaData = payload),
    textgrid: (state, payload) => (state.textgrid = payload),
    frames: (state, payload) => (state.frames = payload),
    autocompletes: (state, payload) => (state.autocompletes = payload)
  },
  actions: {
    async init({ dispatch, commit, state }, id = null) {
      if (state.wavesurfer !== null) {
        state.wavesurfer.wavesurfer.destroy();
        state.wavesurfer = null;
      }
      state.source = null;
      state.textgrid = {};
      state.fps = 0;
      state.frameRate = 0;
      state.name = "";
      state.metaData = {};
      state.frames = [];
      state.item = {};
      state.duration = 0;
      state.videoStream = {};
      state.audioStream = {};
      state.originSize = { height: 0, width: 0 };
      state.tab = 0;

      dispatch("layout/init", { root: true });
      dispatch("frame/init", { root: true });
      dispatch("frameConf/init", { root: true });
      dispatch("complates/init", { root: true });
      dispatch("cache/init", { root: true });
      if (id) {
        state.id = Number(id);
        dispatch("loading/start", "$vuetify.loading", { root: true });
        state.item = await db.files.get(state.id);
        if (state.item.name) {
          state.source = state.item.source;
          commit("video/source", state.item.source);
          commit("video/fps", state.item.fps);
          commit("video/fileName", state.item.name);
          commit("video/duration", state.item.duration);
          commit("video/videoStream", state.item.videoStream);
          commit("video/audioStream", state.item.audioStream);
          commit("video/originSize", state.item.originSize);

          commit("frame/ow", state.item.originSize.width);
          commit("frame/oh", state.item.originSize.height);

          state.fps = state.item.fps;
          state.frameRate = 1 / state.item.fps;
          state.name = state.item.name;
          state.duration = state.item.duration;
          state.videoStream = state.item.videoStream;
          state.audioStream = state.item.audioStream;
          state.originSize = state.item.originSize;
          state.metaData = state.item.metaData;
          state.textgrid = state.item.textgrid || {};
          state.frames = await db.frames
            .where({ fileId: state.item.id })
            .with({
              points: "points",
              rects: "rects",
              polygons: "polygons"
            });
          dispatch("loading/finish", {}, { root: true });
        }
      }
    },
    updateFrames: function({ state, commit }, payload) {
      const i = state.frames.findIndex(x => x.id == payload.id);
      if (i !== -1) {
        const frame = state.frames[i];
        frame.points = payload.points || frame.points;
        frame.rects = payload.rects || frame.rects;
        frame.polygons = payload.polygons || frame.polygons;
        Vue.set(state.frames, i, frame);
        state.item.lastModifiedAt = Date.now();
        state.item.frames = state.frames;
        commit("files/update", state.item, { root: true });
      }
    },
    textgrid: function({ state, commit }, payload) {
      commit("textgrid", payload);
      const textgrid = Object.assign({}, payload);
      for (const key in textgrid) {
        textgrid[key] = {
          values: textgrid[key].values,
          type: textgrid[key].type,
          parent: textgrid[key].parent
        };
      }
      state.item.textgrid = textgrid;
      state.item.lastModifiedAt = Date.now();
      commit("files/update", state.item, { root: true });
      return new Promise((resolve, reject) => {
        if (state.item.name && state.item.id) {
          db.files
            .put(state.item)
            .then(res => resolve(res))
            .catch(error => reject(error));
        } else {
          reject(new Error("no name"));
        }
      });
    },
    // ===================================================
    // フレーム操作
    // ===================================================
    async addPoints({ state, dispatch }, payload) {
      await Promise.all(
        payload.map(async point => {
          const { id, index, time, label, color, x, y } = point;
          if (id && index && time && label && color && x && y) {
            const frame = state.frames.find(
              frame => frame.idx === index
            );
            if (frame !== undefined) {
              const old_point = frame.points.find(p => p.id == id);
              if (old_point === undefined) {
                try {
                  const item = {
                    x,
                    y,
                    color,
                    label,
                    frameId: frame.id
                  };
                  const new_id = await db.points.put(item);
                  item.id = new_id;
                  frame.points.push(item);
                } catch (error) {
                  dispatch("snackbar/error", error.message, {
                    root: true
                  });
                }
              }
            }
          }
          return null;
        })
      );
    },
    deletePoints({ state, commit }) {
      const ids = state.frames
        .filter(f => f.points.length)
        .map(f => f.points.map(p => p.id))
        .flat();
      if (ids.length) {
        db.points
          .bulkDelete(ids)
          .then(() => {
            state.frames = state.frames.map(f => {
              f.points = [];
              return f;
            });
            state.item.lastModifiedAt = Date.now();
            state.item.frames = state.frames;
            commit("files/update", state.item, { root: true });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    deleteRects({ state, commit }) {
      const ids = state.frames
        .filter(f => f.rects.length)
        .map(f => f.rects.map(r => r.id))
        .flat();
      if (ids.length) {
        db.rects
          .bulkDelete(ids)
          .then(() => {
            state.frames = state.frames.map(f => {
              f.rects = [];
              return f;
            });
            state.item.lastModifiedAt = Date.now();
            state.item.frames = state.frames;
            commit("files/update", state.item, { root: true });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // ===================================================
    // WS 操作関連
    // ===================================================
    setTextGrid({ state }, obj) {
      const ws = state.wavesurfer;
      if (ws) {
        state.textgrid = obj;
        setTimeout(() => {
          ws.setTextGrid(obj);
        }, 10);
      }
    },
    zoom({ state }, val) {
      if (state.wavesurfer) this.wavesurfer.zoom(val);
    },
    seekTo({ state }, payload) {
      const isCenter = payload.center ? true : false;
      const time = payload.time || 0;
      if (state.wavesurfer) {
        const p = time / state.duration;
        const progress = p >= 1 ? 1 : p <= 0 ? 0 : p;
        if (isCenter) {
          state.wavesurfer.seekAndCenter(progress);
        } else {
          state.wavesurfer.seekTo(progress);
        }
      }
    },
    skipBackward: function({ state }) {
      if (state.wavesurfer) state.wavesurfer.skipBackward();
    },
    skipForward: function({ state }) {
      if (state.wavesurfer) state.wavesurfer.skipForward();
    },
    addRecord: function({ state }, payload) {
      const { tier, record } = payload;
      if (state.wavesurfer && tier && record) {
        if ("text" in record && "time" in record) {
          state.wavesurfer.addTierValue(tier, record);
        }
      }
    },
    // 現在表示されている VUEWER の転記情報を更新します
    loadObj: function(context, payload) {
      const textgrid = payload.textgrid;
      if (payload.frames && payload.frames.length) {
        context.commit("frames", payload.frames);
      }
      if (textgrid) {
        context.dispatch("setTextGrid", textgrid);
      }
    }
  },
  getters: {
    tgTable: function(state) {
      const array = [["tier", "type", "index", "time", "text"]];
      for (const key in state.textgrid) {
        const tier = state.textgrid[key];
        for (const i in tier.values) {
          const record = tier.values[i];
          const row = [key, tier.type, i, record.time, record.text];
          array.push(row);
        }
      }
      return array;
    },
    frameTable: function(state) {
      const array = [["id", "index", "time"]];
      for (const f of state.frames) {
        const row = [f.id, f.idx, f.time];
        array.push(row);
      }
      return array;
    },
    pointTable: function(state) {
      const array = [
        ["id", "index", "time", "label", "x", "y", "color"]
      ];
      for (const f of state.frames) {
        for (const p of f.points || []) {
          const row = [
            p.id,
            f.idx,
            f.time,
            p.label,
            p.x,
            p.y,
            p.color
          ];
          array.push(row);
        }
      }
      return array;
    },
    polygonTable: function(state) {
      const array = [
        [
          "polygon-id",
          "id",
          "index",
          "time",
          "label",
          "x",
          "y",
          "color"
        ]
      ];
      for (const f of state.frames) {
        for (const polygon of f.polygons || []) {
          for (const p of polygon.points || []) {
            const row = [
              polygon.id,
              p.id,
              f.idx,
              f.time,
              polygon.label,
              p.x,
              p.y,
              polygon.color
            ];
            array.push(row);
          }
        }
      }
      return array;
    },
    rectTable: function(state) {
      const array = [
        [
          "id",
          "index",
          "time",
          "label",
          "x",
          "y",
          "width",
          "height",
          "rotation",
          "scaleX",
          "scaleY",
          "color"
        ]
      ];
      for (const f of state.frames) {
        for (const r of f.rects || []) {
          const row = [
            r.id,
            f.idx,
            f.time,
            r.label,
            r.x,
            r.y,
            r.width,
            r.height,
            r.rotation,
            r.scaleX,
            r.scaleY,
            r.color
          ];
          array.push(row);
        }
      }

      return array;
    }
  },
  modules: {
    video,
    frame,
    layout,
    frameConf,
    complates,
    cache
  }
};
