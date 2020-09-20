import Vue from "vue";
import video from "./video.js";
import frame from "./frame.js";
import layout from "./layout.js";
import complates from "./complates.js";
export default {
  namespaced: true,
  state: () => ({
    wavesurfer: null,
    textgrid: null,
    frames: []
  }),
  mutations: {
    waveSurfer(state, payload) {
      state.wavesurfer = payload;
    },
    textGrid(state, payload) {
      state.textgrid = payload;
    },
    frames(state, payload) {
      state.frames = payload;
    },
    autocompletes(state, payload) {
      state.autocompletes = payload;
    }
  },
  actions: {
    init: function(context) {
      context.state.frames = [];
      context.state.wavesurfer = null;
      context.state.textgrid = null;
    },
    // 現在表示されている VUEWER の転記情報を更新します
    loadObj: function(context, payload) {
      if (payload.frames && payload.frames.length) {
        context.commit("frames", payload.frames);
      }
      if (payload.textgrid) {
        context.dispatch("updateTextGrid", payload.textgrid);
      }
    },
    // 現在表示されている TEXTGRID を更新ます.
    updateTextGrid: function(context, textgrid) {
      const ws = context.state.wavesurfer;
      if (ws) {
        ws.setTextGrid(textgrid);
      } else {
        context.commit("textgrid", textgrid);
      }
    },
    // frames の内の特定のデータを更新します
    updateFrame: function(context, payload) {
      const i = context.state.frames.findIndex(x => x.id == payload.id);
      if (i !== -1) {
        Vue.set(context.state.frames, i, payload);
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
  modules: { video: video, frame: frame, layout: layout, complates: complates }
};
