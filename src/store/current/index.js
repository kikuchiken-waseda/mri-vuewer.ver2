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
      state.wavesurfer = null;
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
        dispatch("loading/start", "$vuetify.loading", { root: true });
        state.item = await db.files.get(Number(id));
        if (state.item.name) {
          state.source = state.item.source;
          state.fps = state.item.fps;
          state.frameRate = 1 / state.item.fps;
          state.name = state.item.name;
          state.duration = state.item.duration;
          state.videoStream = state.item.videoStream;
          state.audioStream = state.item.audioStream;
          state.originSize = state.item.originSize;
          commit("frame/ow", state.item.originSize.width);
          commit("frame/oh", state.item.originSize.height);
          state.metaData = state.item.metaData;
          state.textgrid = state.item.textgrid || {};
          state.frames = await db.frames
            .where({ fileId: state.item.id })
            .with({ points: "points", rects: "rects" });
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
    // WS 操作関連
    // ===================================================
    setTextGrid(context, obj) {
      // 現在表示されている TEXTGRID を更新します
      const ws = context.state.wavesurfer;
      if (ws) {
        ws.setTextGrid(obj);
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

    // 現在表示されている VUEWER の転記情報を更新します
    loadObj: function(context, payload) {
      if (payload.frames && payload.frames.length) {
        context.commit("frames", payload.frames);
      }
      if (payload.textgrid) {
        context.dispatch("setTextGrid", payload.textgrid);
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
      const array = [["id", "index", "time", "label", "x", "y", "color"]];
      for (const f of state.frames) {
        for (const p of f.points || []) {
          const row = [p.id, f.idx, f.time, p.label, p.x, p.y, p.color];
          array.push(row);
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
