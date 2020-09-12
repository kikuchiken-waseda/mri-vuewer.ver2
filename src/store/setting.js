import storage from "@/storage/localStorage.js";
const S = storage.wavesurfer;

const DEFAULTSTATE = {
  showDev: false,
  shouldGetVideoInfo: true,
  shouldGetFrameInfo: true,
  maxVideoSize: 5,
  minPxPerSec: 100,
  freqRate: 0.25,
  targetChannel: 0,
  spectrogramHeight: 256,
  showTimeLine: true,
  showSpectrogram: true,
  showFreqLabel: false,
  cursorColor: "#333",
  waveColor: "#333",
  progressColor: "#555",
  playOffset: 5,
  addRecordKey: "dbl",
  deleteRecordKey: "delete"
};
const DS = DEFAULTSTATE;

export default {
  namespaced: true,
  state: () => ({
    showDev: S.get("showDev") == null ? DS.showDev : S.get("showDev"),
    maxVideoSize: Number(S.get("maxVideoSize")) || DS.maxVideoSize,
    shouldGetVideoInfo:
      S.get("shouldGetVideoInfo") == null
        ? DS.shouldGetVideoInfo
        : S.get("shouldGetVideoInfo"),
    shouldGetFrameInfo:
      S.get("shouldGetFrameInfo") == null
        ? DS.shouldGetFrameInfo
        : S.get("shouldGetFrameInfo"),
    minPxPerSec: Number(S.get("minPxPerSec")) || DS.minPxPerSec,
    freqRate: Number(S.get("freqRate")) || DS.freqRate,
    targetChannel: Number(S.get("targetChannel")) || DS.targetChannel,
    spectrogramHeight:
      Number(S.get("spectrogramHeight")) || DS.spectrogramHeight,
    showTimeLine:
      S.get("showTimeLine") == null ? DS.showTimeLine : S.get("showTimeLine"),
    showSpectrogram:
      S.get("showSpectrogram") == null
        ? DS.showSpectrogram
        : S.get("showSpectrogram"),
    showFreqLabel:
      S.get("showFreqLabel") == null
        ? DS.showSpectrogram
        : S.get("showFreqLabel"),
    cursorColor: S.get("cursorColor") || DS.cursorColor,
    waveColor: S.get("waveColor") || DS.waveColor,
    progressColor: S.get("progressColor") || DS.progressColor,
    playOffset: Number(S.get("playOffset")) || DS.playOffset,
    addRecordKey: S.get("addRecordKey") || DS.addRecordKey,
    deleteRecordKey: S.get("deleteRecordKey") || DS.deleteRecordKey
  }),
  mutations: {
    showDev(state, payload) {
      state.showDev = payload;
      S.set("showDev", payload);
    },
    setMaxVideoSize(state, payload) {
      state.maxVideoSize = Number(payload);
      S.set("maxVideoSize", Number(payload));
    },
    setShouldGetVideoInfo(state, payload) {
      state.shouldGetVideoInfo = payload;
      S.set("shouldGetVideoInfo", payload);
    },
    setShouldGetFrameInfo(state, payload) {
      state.shouldGetFrameInfo = payload;
      S.set("shouldGetFrameInfo", payload);
    },
    setMinPxPerSec(state, payload) {
      state.minPxPerSec = Number(payload);
      S.set("minPxPerSec", Number(payload));
    },
    setFreqRate(state, payload) {
      state.freqRate = Number(payload);
      S.set("freqRate", Number(payload));
    },
    setTargetChannel(state, payload) {
      state.targetChannel = Number(payload);
      S.set("targetChannel", Number(payload));
    },
    setSpectrogramHeight(state, payload) {
      state.spectrogramHeight = Number(payload);
      S.set("spectrogramHeight", Number(payload));
    },
    setShowTimeLine(state, payload) {
      state.showTimeLine = payload;
      S.set("showTimeLine", payload);
    },
    setShowSpectrogram(state, payload) {
      state.showSpectrogram = payload;
      S.set("showSpectrogram", payload);
    },
    setShowFreqLabel(state, payload) {
      state.showFreqLabel = payload;
      S.set("showFreqLabel", payload);
    },
    setCursorColor(state, payload) {
      state.cursorColor = payload;
      S.set("cursorColor", payload);
    },
    setWaveColor(state, payload) {
      state.waveColor = payload;
      S.set("waveColor", payload);
    },
    setPlayOffset(state, payload) {
      state.playOffset = Number(payload);
      S.set("playOffset", Number(payload));
    },
    setProgressColor(state, payload) {
      state.progressColor = payload;
      S.set("progressColor", payload);
    },
    setAddRecordKey(state, payload) {
      const choice = ["dbl", "ctrl", "alt"];
      if (choice.indexOf(payload) !== -1) {
        state.addRecordKey = payload;
        S.set("addRecordKey", payload);
      }
    },
    setDeleteRecordKey(state, payload) {
      const choice = ["delete", "ctrl", "alt"];
      if (choice.indexOf(payload) !== -1) {
        state.deleteRecordKey = payload;
        S.set("deleteRecordKey", payload);
      }
    }
  },
  actions: {
    setDefault(context) {
      context.commit("showDev", DS.showDev);
      context.commit("setMaxVideoSize", DS.maxVideoSize);
      context.commit("setShouldGetVideoInfo", DS.shouldGetVideoInfo);
      context.commit("setShouldGetFrameInfo", DS.shouldGetFrameInfo);
      context.commit("setMinPxPerSec", DS.minPxPerSec);
      context.commit("setFreqRate", DS.freqRate);
      context.commit("setTargetChannel", DS.targetChannel);
      context.commit("setSpectrogramHeight", DS.spectrogramHeight);
      context.commit("setShowTimeLine", DS.showTimeLine);
      context.commit("setShowSpectrogram", DS.showSpectrogram);
      context.commit("setShowFreqLabel", DS.showFreqLabel);
      context.commit("setCursorColor", DS.cursorColor);
      context.commit("setWaveColor", DS.waveColor);
      context.commit("setProgressColor", DS.progressColor);
      context.commit("setPlayOffset", DS.playOffset);
      context.commit("setAddRecordKey", DS.addRecordKey);
      context.commit("setDeleteRecordKey", DS.deleteRecordKey);
    }
  }
};
