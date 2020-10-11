Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

export default {
  namespaced: true,
  state: () => ({
    refTier: null, // フレーム編集時にテキストを表示する TIER
    targetTier: null, // フレーム編集時に境界を付与する TIER
    text: "", // 境界付与時に入力されるメッセージ
    points: [], // フレーム編集時に入力可能なPOINT一覧
    rects: [] // フレーム編集時に入力可能なRECT一覧
  }),
  mutations: {
    refTier: (state, payload) => (state.refTier = payload),
    targetTier: (state, payload) => (state.targetTier = payload),
    text: (state, payload) => (state.text = payload),
    points: (state, payload) => (state.points = payload),
    rects: (state, payload) => (state.rects = payload),
    pushPoint: (state, payload) => state.points.push(payload),
    upPoint: (state, idx) => {
      if (idx > 0) state.points.move(idx, idx - 1);
    },
    downPoint: (state, idx) => {
      if (idx < state.points.length) state.points.move(idx, idx + 1);
    },
    deletePoint: (state, idx) => state.points.splice(idx, 1),
    pushRect: (state, payload) => state.rects.push(payload),
    upRect: (state, idx) => {
      if (idx > 0) state.rects.move(idx, idx - 1);
    },
    downRect: (state, idx) => {
      if (idx < state.rects.length) state.rects.move(idx, idx + 1);
    },
    deleteRect: (state, idx) => state.rects.splice(idx, 1)
  },
  actions: {
    init: function({ state }) {
      state.refTier = null;
      state.targetTier = null;
      state.text = "";
      state.points = [];
      state.rects = [];
    }
  }
};
