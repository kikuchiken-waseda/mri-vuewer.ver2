import storage from "@/storage/localStorage.js";
const S = storage.wavesurfer;

const DEFAULTSTATE = {
  syncPrevPoints: false,
  syncPrevRects: false,
  syncDropbox: false,
  addRecordKey: "dbl",
  cursorColor: "#333",
  deleteRecordKey: "delete",
  freqRate: 0.25,
  maxVideoSize: 5,
  minPxPerSec: 100,
  playOffset: 5,
  progressColor: "#555",
  shouldGetFrameInfo: true,
  shouldGetVideoInfo: true,
  shouldMovePageAferAddingFile: false,
  showDev: false,
  showFrameInVideo: true,
  showPointsInVideo: true,
  showRectsInVideo: true,
  showFreqLabel: false,
  showSpectrogram: true,
  showTimeLine: true,
  spectrogramHeight: 256,
  targetChannel: 0,
  waveColor: "#333",
  nameSep: "-",
  nameFormat: "",
  filesOrderKey: "default"
};
const DS = DEFAULTSTATE;

export default {
  namespaced: true,
  state: () => ({
    syncPrevPoints:
      S.get("syncPrevPoints") == null
        ? DS.syncPrevPoints
        : S.get("syncPrevPoints"),
    syncPrevRects:
      S.get("syncPrevRects") == null
        ? DS.syncPrevRects
        : S.get("syncPrevRects"),
    addRecordKey: S.get("addRecordKey") || DS.addRecordKey,
    cursorColor: S.get("cursorColor") || DS.cursorColor,
    deleteRecordKey: S.get("deleteRecordKey") || DS.deleteRecordKey,
    freqRate: Number(S.get("freqRate")) || DS.freqRate,
    maxVideoSize: Number(S.get("maxVideoSize")) || DS.maxVideoSize,
    minPxPerSec: Number(S.get("minPxPerSec")) || DS.minPxPerSec,
    playOffset: Number(S.get("playOffset")) || DS.playOffset,
    progressColor: S.get("progressColor") || DS.progressColor,
    syncDropbox:
      S.get("syncDropbox") == null ? DS.syncDropbox : S.get("syncDropbox"),
    shouldGetFrameInfo:
      S.get("shouldGetFrameInfo") == null
        ? DS.shouldGetFrameInfo
        : S.get("shouldGetFrameInfo"),
    shouldGetVideoInfo:
      S.get("shouldGetVideoInfo") == null
        ? DS.shouldGetVideoInfo
        : S.get("shouldGetVideoInfo"),
    shouldMovePageAferAddingFile:
      S.get("shouldMovePageAferAddingFile") == null
        ? DS.shouldMovePageAferAddingFile
        : S.get("shouldMovePageAferAddingFile"),
    showDev: S.get("showDev") == null ? DS.showDev : S.get("showDev"),
    showFrameInVideo:
      S.get("showFrameInVideo") == null
        ? DS.showFrameInVideo
        : S.get("showFrameInVideo"),
    showPointsInVideo:
      S.get("showPointsInVideo") == null
        ? DS.showPointsInVideo
        : S.get("showPointsInVideo"),
    showRectsInVideo:
      S.get("showRectsInVideo") == null
        ? DS.showRectsInVideo
        : S.get("showRectsInVideo"),
    showFreqLabel:
      S.get("showFreqLabel") == null
        ? DS.showSpectrogram
        : S.get("showFreqLabel"),
    showSpectrogram:
      S.get("showSpectrogram") == null
        ? DS.showSpectrogram
        : S.get("showSpectrogram"),
    showTimeLine:
      S.get("showTimeLine") == null ? DS.showTimeLine : S.get("showTimeLine"),
    spectrogramHeight:
      Number(S.get("spectrogramHeight")) || DS.spectrogramHeight,
    targetChannel: Number(S.get("targetChannel")) || DS.targetChannel,
    waveColor: S.get("waveColor") || DS.waveColor,
    nameFormat: S.get("nameFormat") || DS.nameFormat,
    nameSep: S.get("nameSep") || DS.nameSep,
    filesOrderKey: S.get("filesOrderKey") || DS.filesOrderKey
  }),
  mutations: {
    filesOrderKey(state, payload) {
      state.filesOrderKey = payload;
      S.set("filesOrderKey", payload);
    },
    syncPrevPoints(state, payload) {
      state.syncPrevPoints = payload;
      S.set("syncPrevPoints", payload);
    },
    syncPrevRects(state, payload) {
      state.syncPrevRects = payload;
      S.set("syncPrevRects", payload);
    },
    showDev(state, payload) {
      state.showDev = payload;
      S.set("showDev", payload);
    },
    showFrameInVideo(state, payload) {
      state.showFrameInVideo = payload;
      S.set("showFrameInVideo", payload);
    },
    syncDropbox(state, payload) {
      state.syncDropbox = payload;
      S.set("syncDropbox", payload);
    },
    showPointsInVideo(state, payload) {
      state.showPointsInVideo = payload;
      S.set("showPointsInVideo", payload);
    },
    showRectsInVideo(state, payload) {
      state.showRectsInVideo = payload;
      S.set("showRectsInVideo", payload);
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
    shouldMovePageAferAddingFile(state, payload) {
      state.shouldMovePageAferAddingFile = payload;
      S.set("shouldMovePageAferAddingFile", payload);
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
    },
    nameFormat(state, payload) {
      state.nameFormat = payload;
      S.set("nameFormat", payload);
    },
    nameSep(state, payload) {
      state.nameSep = payload;
      S.set("nameSep", payload);
    }
  },
  actions: {
    setDefault(context) {
      context.commit("syncDropbox", DS.syncDropbox);
      context.commit("showDev", DS.showDev);
      context.commit("showFrameInVideo", DS.showFrameInVideo);
      context.commit("showPointsInVideo", DS.showPointsInVideo);
      context.commit("showRectsInVideo", DS.showRectsInVideo);
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
  },
  getters: {
    fname2meta: state => filename => {
      if (state.nameFormat) {
        const vals = filename.split(".")[0].split(state.nameSep);
        const fields = state.nameFormat.split(state.nameSep);
        const data = {};
        if (fields.length == vals.length) {
          for (const i in fields) {
            data[fields[i]] = vals[i];
          }
          return data;
        }
      }
      return null;
    }
  }
};
