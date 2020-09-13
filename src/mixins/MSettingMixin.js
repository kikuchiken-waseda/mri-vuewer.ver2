export default {
  computed: {
    // ビデオにフレーム情報を提示する
    $showFrameInVideo: {
      get() {
        return this.$store.state.setting.showFrameInVideo;
      },
      set(val) {
        this.$store.commit("setting/showFrameInVideo", val);
      }
    },
    // 開発者ページを表示する
    $showDev: {
      get() {
        return this.$store.state.setting.showDev;
      },
      set(val) {
        this.$store.commit("setting/showDev", val);
      }
    },
    // 最大ビデオサイズ
    $maxVideoSize: {
      get() {
        return this.$store.state.setting.maxVideoSize;
      },
      set(val) {
        const type = typeof val;
        if (type == "number") {
          this.$store.commit("setting/setMaxVideoSize", val);
        } else if (type == "string") {
          if (Number(val)) {
            this.$store.commit("setting/setMaxVideoSize", Number(val));
          }
        }
      }
    },
    // 動画読み込みに情報を取得する
    $shouldGetVideoInfo: {
      get() {
        return this.$store.state.setting.shouldGetVideoInfo;
      },
      set(val) {
        this.$store.commit("setting/setShouldGetVideoInfo", val);
      }
    },
    // 動画読み込みにフレーム情報を取得する
    $shouldGetFrameInfo: {
      get() {
        return this.$store.state.setting.shouldGetFrameInfo;
      },
      set(val) {
        this.$store.commit("setting/setShouldGetFrameInfo", val);
      }
    },
    // 動画読み込みにフレーム情報を取得する
    $minPxPerSec: {
      get() {
        return this.$store.state.setting.minPxPerSec;
      },
      set(val) {
        const type = typeof val;
        let minPxPerSec = null;
        if (type == "number") {
          minPxPerSec = val;
        } else if (type == "string") {
          minPxPerSec = Number(val);
        }
        if (minPxPerSec) {
          this.$store.commit("setting/setMinPxPerSec", minPxPerSec);
        }
      }
    },
    // スペクトログラム表示上限周波数率
    $freqRate: {
      get() {
        return this.$store.state.setting.freqRate;
      },
      set(val) {
        const type = typeof val;
        if (type == "number") {
          this.$store.commit("setting/setFreqRate", val);
        } else if (type == "string") {
          if (Number(val)) {
            this.$store.commit("setting/setFreqRate", Number(val));
          }
        }
      }
    },
    // スペクトログラム対象チャンネル
    $targetChannel: {
      get() {
        return this.$store.state.setting.targetChannel;
      },
      set(val) {
        this.$store.commit("setting/setTargetChannel", val);
      }
    },
    // スペクトログラム表示高さ上限
    $spectrogramHeight: {
      get() {
        return this.$store.state.setting.spectrogramHeight;
      },
      set(val) {
        this.$store.commit("setting/setSpectrogramHeight", val);
      }
    },
    // 時間軸表示の有無
    $showTimeLine: {
      get() {
        return this.$store.state.setting.showTimeLine;
      },
      set(val) {
        this.$store.commit("setting/setShowTimeLine", val);
      }
    },
    // スペクトログラム表示の有無
    $showSpectrogram: {
      get() {
        return this.$store.state.setting.showSpectrogram;
      },
      set(val) {
        this.$store.commit("setting/setShowSpectrogram", val);
      }
    },
    // 周波数ラベル表示の有無
    $showFreqLabel: {
      get() {
        return this.$store.state.setting.showFreqLabel;
      },
      set(val) {
        this.$store.commit("setting/setShowFreqLabel", val);
      }
    },
    // WAVE カーソル色
    $cursorColor: {
      get() {
        return this.$store.state.setting.cursorColor;
      },
      set(val) {
        this.$store.commit("setting/setCursorColor", val);
      }
    },
    // 未再生 WAVE 色
    $waveColor: {
      get() {
        return this.$store.state.setting.waveColor;
      },
      set(val) {
        this.$store.commit("setting/setWaveColor", val);
      }
    },
    // 再生 WAVE 色
    $progressColor: {
      get() {
        return this.$store.state.setting.progressColor;
      },
      set(val) {
        this.$store.commit("setting/setProgressColor", val);
      }
    },
    // レコード追加キーの種類
    $addRecordKey: {
      get() {
        return this.$store.state.setting.addRecordKey;
      },
      set(val) {
        this.$store.commit("setting/setAddRecordKey", val);
      }
    },
    // レコード削除キーの種類
    $deleteRecordKey: {
      get() {
        return this.$store.state.setting.deleteRecordKey;
      },
      set(val) {
        this.$store.commit("setting/setDeleteRecordKey", val);
      }
    },
    // 音声再生オフセット
    $playOffset: {
      get() {
        return this.$store.state.setting.playOffset;
      },
      set(val) {
        const type = typeof val;
        if (type == "number") {
          this.$store.commit("setting/setPlayOffset", val);
        } else if (type == "string") {
          if (Number(val)) {
            this.$store.commit("setting/setPlayOffset", Number(val));
          }
        }
      }
    }
  },
  methods: {
    setDefaultSetting: function() {
      this.$store.dispatch("setting/setDefault");
    }
  }
};
