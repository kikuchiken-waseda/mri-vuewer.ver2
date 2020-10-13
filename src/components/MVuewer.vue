<template>
  <m-w-context-menu
    @click-setting="onClickSetting"
    @click-save="fireUpdateData"
    @click-load-dropbox="onClickLoadDropbox"
    @click-image-edit="onClickImageEdit"
    @click-tier-add="onClickTierAdd"
    @click-tier-edit="onClickTierEdit"
    @click-tier-delete="onClickTierDelete"
    @click-upload="onUploadClick"
    @click-download="onDownloadClick"
    @click-noise-reduction="onClickNoiseReduction"
    @click-complate="onClickComplate"
    @click-record="onClickRecordContextMenu"
    @click-interval="onClickIntervalContextMenu"
  >
    <m-vuwer-layout
      v-if="!$store.state.loading.show"
      ref="layout"
      @resize="onResize"
    >
      <template v-slot:video>
        <m-video-array
          ref="videoArray"
          v-if="$source"
          :src="$source"
          :fps="$fps"
          :frameOffset="frameOffset"
          @loadeddata="onLoadeddata"
          @frame-updated="onFrameUpdated"
          @mouseover="onMouseover('video-array')"
          @keyup="onVideoArrayKeyup"
        />
        <m-vuwer-actions
          @download-click="onDownloadClick"
          @upload-click="onUploadClick"
          @mouseover="onMouseover('actions')"
          :fps="$fps"
          v-if="wavesurfer"
        />
      </template>
      <template v-slot:table>
        <m-text-grid
          ref="tables"
          @click-image-edit="onClickImageEdit"
          @click-ruler="onClickRuler"
          @keyup="onTableKeyup"
          @mouseover="onMouseover('tables')"
          :frames="$frames"
          :textgrid="$textgrid"
          :video-height="videoHeight"
        />
      </template>
      <v-card flat @mouseover="onMouseover('wave-surfer')">
        <wave-surfer
          normalize
          responsive
          scrollParent
          showTextGrid
          splitChannels
          ref="wavesurfer"
          backend="MediaElement"
          textgrid-max-height="100px"
          :source="videoElm"
          :skipLength="skipLength"
          :minPxPerSec="$minPxPerSec"
          :drawingContextAttributes="drawingContextAttributes"
          :cursorColor="$store.state.setting.cursorColor"
          :freqRate="$store.state.setting.freqRate"
          :showFreqLabel="$store.state.setting.showFreqLabel"
          :showSpectrogram="$store.state.setting.showSpectrogram"
          :showTimeLine="$store.state.setting.showTimeLine"
          :spectrogramHeight="$store.state.setting.spectrogramHeight"
          :targetChannel="$store.state.setting.targetChannel"
          :waveColor="$store.state.setting.waveColor"
          :progressColor="$store.state.setting.progressColor"
          @spectrogram-render-end="onSpectrogramRenderEnd"
          @spectrogram-render-start="onSpectrogramRenderStart"
          @spectrogram-keyup="onWaveSurferKeyup"
          @waveform-keyup="onWaveSurferKeyup"
          @textgrid-click="onTextGridClick"
          @textgrid-current-update="onRecordUpdated"
          @textgrid-dblclick="onTextGridDblClick"
          @textgrid-keydown="onTextGridKeydown"
          @textgrid-update="onTextGridUpdate"
          @tier-add="onTextGridUpdate"
          @tier-delete="onTextGridUpdate"
          @tier-update="onTextGridUpdate"
        >
          <template v-slot:textform>
            <m-record-text-field
              ref="input"
              v-if="showTextField"
              v-model="current.tier.record.text"
              :complate-key="current.key"
              :disabled="current.tier.key == null"
              @click:prepend-inner-icon="onVoiceUpdateRecordText"
              @enter="onUpdateRecordText"
              @next="onUpdateRecordText('next')"
              @esc="onEscTextField"
            />
          </template>

          <div class="text-center" v-if="isLoading">
            <v-progress-circular
              :size="100"
              :width="10"
              color="primary"
              indeterminate
            />
            <div class="font-weight-light subtitle-1">
              Sound Analyzing ...
            </div>
          </div>
        </wave-surfer>
      </v-card>

      <template v-slot:bottom>
        <m-speed-dial
          v-model="fab"
          @click-save="fireUpdateData"
          @click-save-dropbox="fireUpdateData"
          @click-setting="onClickSetting"
          @click-detail="onClickDetail"
          @click-ruler="onClickRuler"
          @click-image-edit="onClickImageEdit"
          @click-tier-add="onClickTierAdd"
          @click-tier-edit="onClickTierEdit"
          @click-tier-delete="onClickTierDelete"
        />
        <m-detail-dialog
          v-model="dialog.detail.show"
          @download-click="onDownloadClick"
          @upload-click="onUploadClick"
        />
        <m-textgrid-dialog
          v-model="dialog.textgrid.show"
          v-if="$store.state.current.layout.mini"
          :frames="$frames"
          :textgrid="$textgrid"
          @click-image-edit="onClickImageEdit"
          @click-ruler="onClickRuler"
        />
        <m-setting-dialog v-model="dialog.setting.show" />
        <m-tier-dialog
          v-model="dialog.tier.show"
          :tiers="tiers"
          :current="current.tier.key"
        />
        <m-tier-edit-dialog
          v-model="dialog.tierEdit.show"
          :tiers="tiers"
          :current="current.tier.key"
        />
        <m-tier-delete-dialog
          v-model="dialog.tierDelete.show"
          :tiers="tiers"
          :current="current.tier.key"
        />
        <m-ruler-dialog v-model="dialog.ruler.show" />
        <m-image-edit-dialog v-model="dialog.imageEdit.show" />
        <m-complates-dialog v-model="dialog.complates.show" />
      </template>
    </m-vuwer-layout>
  </m-w-context-menu>
</template>

<script>
/**
 * MVuwer.vue
 *
 * このコンポーネントの役割は種々アノテーション画面情報の受け渡しです.
 * 基本的にそれ以外のことはしないことに注意してください.
 */
import WaveSurfer from "wavesurfer.vue";
import MVuwerLayout from "@/components/layouts/MVuwerLayout";
import MVideoArray from "@/components/video/MVideoArray";
import MTextGrid from "@/components/MTextGrid";
import MVuwerActions from "@/components/actions/MVuewerActions";
import MRecordTextField from "@/components/form/MRecordTextField";
import MWContextMenu from "@/components/contextmenus/MWContextMenu";
import MDetailDialog from "@/components/dialogs/MDetailDialog";
import MTierDialog from "@/components/dialogs/MTierDialog";
import MTierEditDialog from "@/components/dialogs/MTierEditDialog";
import MTierDeleteDialog from "@/components/dialogs/MTierDeleteDialog";
import MRulerDialog from "@/components/dialogs/MRulerDialog";
import MImageEditDialog from "@/components/dialogs/MImageEditDialog";
import MSettingDialog from "@/components/dialogs/MSettingDialog";
import MTextgridDialog from "@/components/dialogs/MTextgridDialog";
import MComplatesDialog from "@/components/dialogs/MComplatesDialog";
import MSpeedDial from "@/components/MSpeedDial";

export default {
  name: "WVuwer",
  components: {
    MVuwerLayout,
    MVideoArray,
    MTextGrid,
    WaveSurfer,
    MWContextMenu,
    MSpeedDial,
    MComplatesDialog,
    MDetailDialog,
    MImageEditDialog,
    MRulerDialog,
    MSettingDialog,
    MTextgridDialog,
    MTierDeleteDialog,
    MTierDialog,
    MTierEditDialog,
    MRecordTextField,
    MVuwerActions
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    frameOffset: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    tag: "WVuwer",
    videoElm: null, // WS のレンダ対象
    videoHeight: null, // ビデオ表示領域の最大幅
    isLoading: false, // WS がレンダ中か否か
    isSyncing: false, // 過去データを反映中か否か
    lazyRular: false, // 時刻変更後にルーラーダイアログを起動
    lazyImageEdit: false, // 時刻変更後に画像編集ダイアログを起動
    lazyFocusTextField: false, // 時刻変更後にText field にフォーカスする
    drawingContextAttributes: {
      desynchronized: false
    },
    fab: false, // fab ボタンの開閉制御
    where: null, // マウスがどこにいるか
    dialog: {
      detail: { show: false },
      textgrid: { show: false },
      tier: { show: false },
      tierEdit: { show: false },
      tierDelete: { show: false },
      ruler: { show: false },
      imageEdit: { show: false },
      setting: { show: false },
      complates: { show: false }
    },
    keybuffer: {
      time: null,
      keycode: null,
      key: null,
      xKey: null,
      from: null
    },
    current: {
      // 現在フォーカスが当たっている TIER 情報
      tier: {
        key: null, // 現在フォーカスされている Tier 名
        values: [], // 現在フォーカスされている レコード一覧
        // 現在選択されている RECORD
        record: {
          idx: 0,
          text: "",
          time: 0
        }
      },
      // 現在時刻のフレーム情報
      frame: {
        idx: null, // 現在フレーム番号
        time: null, // 現在フレーム時刻
        src: null, // 現在フレーム画像
        points: [],
        rects: [],
        texts: []
      }
    },
    tiers: []
  }),
  computed: {
    wavesurfer: {
      get() {
        return this.$store.state.current.wavesurfer;
      },
      set(val) {
        this.$store.commit("current/waveSurfer", val);
      }
    },
    $minPxPerSec: {
      get() {
        return this.$store.state.setting.minPxPerSec;
      },
      set(val) {
        const type = typeof val;
        const minPxPerSec = type == "number" ? val : Number(val);
        if (minPxPerSec)
          this.$store.commit("setting/setMinPxPerSec", minPxPerSec);
      }
    },
    $textgrid: {
      get() {
        return this.$store.state.current.textgrid;
      },
      set(obj) {
        this.$store
          .dispatch("current/textgrid", obj)
          .then(id => {
            const msg = `update the textgrid of a file (id=${id})`;
            this.$vuewer.db.log("textgrid", "PUT", msg);
            this.$store.dispatch("current/cache/setTextgrid", obj);
          })
          .catch(error => {
            this.$vuewer.console.error("vuewer:textgrid:put", error);
          });
      }
    },
    $frames: {
      get() {
        return this.$store.state.current.frames;
      },
      set(val) {
        this.$store.commit("current/frames", val);
      }
    },
    $duration: {
      get() {
        return this.$store.state.current.duration;
      },
      set(val) {
        this.$store.commit("current/duration", Number(val));
      }
    },

    $source() {
      return this.$store.state.current.source;
    },
    $fps() {
      return this.$store.state.current.fps;
    },
    $frameRate() {
      return this.$store.state.current.frameRate;
    },
    $frameIdx() {
      return this.$store.state.current.frame.idx;
    },
    // スキップ時の長さ
    skipLength: function() {
      return this.frameOffset * this.$frameRate;
    },
    // 転記階層記入欄を表示するか否か
    showTextField: function() {
      if (this.videoElm) {
        if (this.$textgrid) {
          if (!this.isLoading) {
            return Object.keys(this.$textgrid).length > 0;
          }
        }
      }
      return false;
    }
  },
  watch: {
    id: function(val, old) {
      if (val != old) this.$store.dispatch("current/init", val);
    },
    $textgrid: {
      handler: function(val, oldVal) {
        if (val && val != oldVal) {
          this.tiers = [];
          for (const key in val) {
            this.tiers.push(key);
          }
        }
      },
      deep: true
    },
    $minPxPerSec: function(val) {
      if ((val > 100) & (val < 700)) {
        if (val % 50 == 0) {
          this.$store.dispatch("current/zoom", val);
        }
      }
    },
    "dialog.imageEdit.show": function(val) {
      if (val == false) {
        this.$refs.videoArray.focus();
      }
    }
  },
  methods: {
    rebaseTextgrid: function(n = 1) {
      const textgrid = this.$store.getters["current/cache/textgrids"](n);
      if (textgrid !== null) {
        this.$store.dispatch("current/setTextGrid", textgrid);
      }
    },
    playPause: function() {
      const key = this.current.tier.key || null;
      const idx = this.current.tier.record.idx || null;
      const time = this.current.tier.record.time || null;
      const currentTime = this.wavesurfer.getCurrentTime();
      if (key && idx && time > currentTime) {
        this.playRecord(key, idx);
      } else {
        this.wavesurfer.playPause();
      }
    },
    // レコード操作
    addRecord: function(key, time, text = "") {
      const item = { time: time, text: text };
      this.wavesurfer.addTierValue(key, item);
      if (!this.isSyncing) {
        this.$vuewer.console.log(
          this.tag,
          `add a record (key: ${key}, time: ${time})`
        );
      }
    },
    deleteRecord: function(key, idx) {
      if (idx > -1) {
        const type = this.$textgrid[key].type;
        const len = this.$textgrid[key].values.length;
        if (type != "interval" || len > 1) {
          this.wavesurfer.deleteTierValue(key, idx);
          if (!this.isSyncing) {
            this.$vuewer.console.log(
              this.tag,
              `delete a record (key: ${key} idx: ${idx})`
            );
          }
        }
      }
    },
    updateRecordText(key, idx, text = "") {
      const time = this.$textgrid[key].values[idx].time;
      const item = { time, text };
      this.wavesurfer.setTierValue(key, idx, item);
    },
    deleteRecordText(key, idx) {
      const item = this.$textgrid[key].values[idx];
      if (item.text) {
        this.copyRecord(key, idx);
        item.text = "";
        this.wavesurfer.setTierValue(key, idx, item);
        this.current.tier.record.text = null;
      } else {
        this.deleteRecord(key, idx);
      }
    },
    playRecord: function(key, idx) {
      if (this.wavesurfer.isPlaying()) {
        this.wavesurfer.pause();
      } else {
        const current = this.$textgrid[key].values[idx];
        if (this.$textgrid[key].type == "interval") {
          if (idx > 0) {
            const prev = this.$textgrid[key].values[idx - 1];
            if (current.time && prev.time) {
              this.wavesurfer.play(prev.time, current.time);
            }
          } else {
            this.wavesurfer.play(0, current.time);
          }
        } else {
          const d = this.$duration;
          const offset = this.$playOffset * this.$frameRate;
          const start = current.time - offset > 0 ? current.time - offset : 0;
          const end = current.time + offset < d ? current.time + offset : d;
          this.wavesurfer.play(start, end);
        }
      }
    },
    copyRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      if (navigator.clipboard) {
        navigator.clipboard.writeText(target.text);
      } else {
        this.showBrowserError();
      }
    },
    copyRecords(key) {
      if (navigator.clipboard) {
        const tier = this.$textgrid[key];
        const values = tier.values;
        const item = {
          "x-special": "vuewer:tier",
          type: tier.type,
          parent: null,
          key,
          values
        };
        const text = JSON.stringify(item);
        navigator.clipboard.writeText(text);
      } else {
        this.showBrowserError();
      }
    },
    async paste() {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        try {
          const obj = JSON.parse(text);
          if (obj["x-special"] == "vuewer:tier") {
            const textgrid = this.$textgrid;
            textgrid[`${obj.key}-copy`] = {
              type: obj.type,
              parent: obj.parent,
              values: obj.values
            };
            this.$store.dispatch("current/setTextGrid", textgrid);
            const keys = Object.keys(this.$textgrid);
            this.focusRecord(keys[keys.length - 1]);
          }
        } catch {
          this.pasteRecord(this.current.key, this.current.tier.record.idx);
        }
      }
    },
    async pasteRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      const time = target.time;
      const text = await navigator.clipboard.readText();
      const item = { time, text };
      this.wavesurfer.setTierValue(key, idx, item);
      this.current.tier.record.text = text;
      if (!this.isSyncing) {
        const msg = `update text a record (key: ${key} idx: ${idx})`;
        this.$vuewer.console.log(this.tag, msg);
      }
    },
    focusRecord(key = null) {
      const tg = this.wavesurfer.wavesurfer.textgrid;
      const time = this.wavesurfer.getCurrentTime();
      const $key =
        key !== null ? key : this.current.key || Object.keys(this.$textgrid)[0];
      if ($key) {
        const values = this.$textgrid[$key].values;
        if (values) {
          const current = values
            .sort((a, b) => a.time > b.time)
            .find(x => x.time > time);
          tg.setCurrent(key, current);
          tg.tiers[key].canvas.focus();
        }
      }
    },
    nextRecord(key, idx, focus) {
      if (idx + 1 < this.$textgrid[key].values.length) {
        const next = this.$textgrid[key].values[idx + 1];
        if (next) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, next);
          this.$store.dispatch("current/seekTo", {
            time: next.time,
            center: true
          });
        }
      } else {
        const next = this.$textgrid[key].values[0];
        if (next) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, next);
          this.$store.dispatch("current/seekTo", {
            time: next.time,
            center: true
          });
        }
      }
    },
    prevRecord(key, idx, focus) {
      if (idx - 1 > -1) {
        const prev = this.$textgrid[key].values[idx - 1];
        if (prev) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, prev);
          this.$store.dispatch("current/seekTo", {
            time: prev.time,
            center: true
          });
        }
      } else {
        const values = this.$textgrid[key].values;
        const prev = this.$textgrid[key].values[values.length - 1];
        if (prev) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, prev);
          this.$store.dispatch("current/seekTo", {
            time: prev.time,
            center: true
          });
        }
      }
    },
    toStartRecord(key, idx) {
      // 現在レコードの始端に移動
      if (this.$textgrid[key].type == "interval") {
        if (idx - 1 > -1) {
          const prev = this.$textgrid[key].values[idx - 1];
          this.$store.dispatch("current/seekTo", {
            time: prev.time,
            center: true
          });
        }
      } else {
        const target = this.$textgrid[key].values[idx];
        this.$store.dispatch("current/seekTo", {
          time: target.time,
          center: true
        });
      }
      this.focusTier(key);
    },
    toEndRecord(key, idx) {
      // 現在レコードの終端に移動
      const target = this.$textgrid[key].values[idx];
      this.$store.dispatch("current/seekTo", {
        time: target.time,
        center: true
      });
      this.focusTier(key);
    },
    extendRecord(key, idx) {
      const tier = this.$textgrid[key];
      const target = tier.values[idx];
      const d = this.$duration;
      const lim = idx + 1 == tier.length ? d : tier.values[idx + 1].time;
      const time = target.time + this.$frameRate;
      if (time < lim) {
        const item = { text: target.text, time: time };
        this.wavesurfer.setTierValue(key, idx, item);
        if (!this.isSyncing) {
          this.$vuewer.console.log(
            this.tag,
            `update time a record (key: ${key} idx: ${idx})`
          );
        }
        this.$store.dispatch("current/seekTo", {
          time,
          center: false
        });
      }
    },
    shrinkRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      const lim = idx == 0 ? 0 : this.$textgrid[key].values[idx - 1].time;
      const type = this.$textgrid[key].type;
      const time = target.time - this.$frameRate;
      if (time > lim) {
        const item = { text: target.text, time: time };
        if (
          type == "interval" &&
          idx == this.$textgrid[key].values.length - 1
        ) {
          return;
        } else {
          this.wavesurfer.setTierValue(key, idx, item);
          if (!this.isSyncing) {
            this.$vuewer.console.log(
              this.tag,
              `update time a record (key: ${key} idx: ${idx})`
            );
          }
          this.$store.dispatch("current/seekTo", { time, center: false });
        }
      }
    },
    splitRecord(key, idx, type) {
      this.$vuewer.console.log(
        this.tag,
        `split a record (key: ${key} idx: ${idx})`
      );
      if (type == "frames") {
        // フレーム分割
        this.wavesurfer.splitTierValue(key, idx, this.$frameRate);
      } else if (type == "chars") {
        // 文字別分割
        this.wavesurfer.splitTierValue(key, idx);
      } else {
        // 区切り文字分割
        this.wavesurfer.splitTierValue(key, idx, type);
      }
    },
    tokenizeRecord(key, idx, type) {
      const record = this.$textgrid[key].values[idx];
      const tokenize = this.$vuewer.text[type];
      if (tokenize && record.text) {
        tokenize(record.text).then(res => {
          if (res) {
            const item = { text: res.join("/"), time: record.time };
            this.wavesurfer.setTierValue(key, idx, item);
          }
        });
      }
    },
    // Tier 操作
    nextTier() {
      const key = this.current.tier.key;
      const keys = Object.keys(this.$textgrid);
      const idx = keys.findIndex(x => x == key);
      if (idx != -1 && idx + 1 < keys.length) {
        this.focusTier(keys[idx + 1]);
      }
    },
    prevTier() {
      const key = this.current.tier.key;
      const keys = Object.keys(this.$textgrid);
      const idx = keys.findIndex(x => x == key);
      if (idx != -1 && idx - 1 > -1) {
        this.focusTier(keys[idx - 1]);
      }
    },
    focusTier(key) {
      setTimeout(() => {
        const tg = this.wavesurfer.wavesurfer.textgrid;
        if (key != this.current.tier.key) {
          const target = this.$vuewer.math.nearest(
            this.$textgrid[key].values,
            "time",
            this.wavesurfer.getCurrentTime()
          );
          tg.setCurrent(key, target);
        }
        tg.tiers[key].canvas.focus();
      });
    },
    deleteTier(key) {
      this.copyRecords(key);
      this.wavesurfer.deleteTier(key);
    },
    tokenizeTier(key, type) {
      const records = this.$textgrid[key].values;
      const tokenize = this.$vuewer.text[type];
      const texts = records.map(r => r.text).join("&");
      if (tokenize && texts) {
        tokenize(texts).then(res => {
          if (res) {
            const new_texts = res.join("/").split("&");
            const new_records = new_texts.map((t, i) => {
              return {
                time: records[i].time,
                text: new_texts[i].replace(/(?:^\/)|(?:\/$)/g, "")
              };
            });
            const textgrid = this.$textgrid;
            textgrid[key].values = new_records;
            this.$store.dispatch("current/setTextGrid", textgrid);
          }
        });
      }
    },
    // EVENT 発火
    fireUpdateData: function() {
      const payload = {
        textgrid: this.$textgrid,
        frames: this.$frames
      };
      this.$emit("data-updated", payload);
    },
    // EVENT ハンドラー
    onResize: function(payload) {
      this.$vuewer.console.log(this.tag, `on resize`);
      this.videoHeight = payload;
    },
    onDownloadClick: function(payload) {
      this.$vuewer.console.log(this.tag, `on download`);
      const bname = this.$store.state.current.video.filename.split(".")[0];
      if (payload == "XLSX") {
        const obj = {
          records: this.$store.getters["current/tgTable"],
          frames: this.$store.getters["current/frameTable"],
          points: this.$store.getters["current/pointTable"],
          rects: this.$store.getters["current/rectTable"]
        };
        const blob = this.$vuewer.io.xlsx.dump(obj);
        this.$vuewer.io.file.download(blob, `${bname}.xlsx`);
      } else if (payload == "JSON") {
        this.$emit("download-json");
      } else if (payload == "PNG") {
        if (this.$refs.videoArray) this.$refs.videoArray.downloadImage();
      } else if (payload == "MP4") {
        const key = this.current.tier.key || Object.keys(this.$textgrid)[0];
        if (key) {
          const tier = this.$textgrid[key];
          const idx = this.current.tier.record.idx || 0;
          const item = tier.values[idx];
          const d = this.$duration;
          let start = 0;
          let end = d;
          if (tier.type == "interval") {
            start = idx == 0 ? 0 : tier.values[idx - 1].time;
            end = item.time;
          } else {
            const offsetS = item.time - this.playOffset;
            const offsetE = item.time + this.playOffset;
            start = offsetS < 0 ? 0 : offsetS;
            end = offsetE > d ? d : offsetE;
          }
          const bname = this.$store.state.current.video.filename.split(".")[0];
          const name = `${bname}.mp4`;
          const buff = this.$vuewer.io.file.toBuff(this.$source);
          const result = this.$vuewer.io.video.trim(buff, start, end);
          const out = result.MEMFS[0];
          const blob = this.$vuewer.io.video.toBlob(Buffer(out.data));
          this.$vuewer.io.file.download(blob, name);
        }
      } else if (payload == "TEXTGRID/JSON") {
        const blob = new Blob([JSON.stringify(this.$textgrid, null, "  ")], {
          type: "application/json"
        });
        this.$vuewer.io.file.download(blob, `${bname}-records.json`);
      } else if (payload == "TEXTGRID/TEXTGRID") {
        this.wavesurfer.downloadTextGrid(`${bname}.TextGrid`);
      } else if (payload == "TEXTGRID/XLSX") {
        const obj = {
          records: this.$store.getters["current/tgTable"]
        };
        const blob = this.$vuewer.io.xlsx.dump(obj);
        this.$vuewer.io.file.download(blob, `${bname}-records.xlsx`);
      } else if (payload == "FRAME/JSON") {
        const blob = new Blob([JSON.stringify(this.$frames, null, "  ")], {
          type: "application/json"
        });
        this.$vuewer.io.file.download(blob, `${bname}-frame.json`);
      } else if (payload == "FRAME/XLSX") {
        const obj = {
          frames: this.$store.getters["current/frameTable"],
          points: this.$store.getters["current/pointTable"],
          rects: this.$store.getters["current/rectTable"]
        };
        const blob = this.$vuewer.io.xlsx.dump(obj);
        this.$vuewer.io.file.download(blob, `${bname}.xlsx`);
      } else {
        this.$vuewer.snackbar.warning("$vuetify.yet");
      }
    },
    onUploadClick: function(payload) {
      this.$vuewer.console.log(this.tag, `on upload: ${payload.click}`);
      const file = payload.files[0];
      if (file) {
        if (payload.click == "TEXTGRID/JSON") {
          this.$vuewer.io.json.read(file).then(obj => {
            const textgrid = this.$vuewer.io.obj.ver2.loadTextGrid(obj);
            this.$store.dispatch("current/setTextGrid", textgrid);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          });
        } else if (payload.click == "TEXTGRID/JSON/VER1") {
          this.$vuewer.io.json.read(file).then(obj => {
            const textgrid = this.$vuewer.io.obj.ver1.loadTextGrid(obj, "both");
            this.$store.dispatch("current/setTextGrid", textgrid);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          });
        } else if (payload.click == "TEXTGRID/JSON/VER1/LEFT") {
          this.$vuewer.io.json.read(file).then(obj => {
            const textgrid = this.$vuewer.io.obj.ver1.loadTextGrid(obj, "left");
            this.$store.dispatch("current/setTextGrid", textgrid);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          });
        } else if (payload.click == "TEXTGRID/JSON/VER1/RIGHT") {
          this.$vuewer.io.json.read(file).then(obj => {
            const textgrid = this.$vuewer.io.obj.ver1.loadTextGrid(
              obj,
              "right"
            );
            this.$store.dispatch("current/setTextGrid", textgrid);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          });
        } else if (payload.click == "TEXTGRID/JSON/VER1/UP-DOWN") {
          this.$vuewer.io.json.read(file).then(obj => {
            const textgrid = this.$vuewer.io.obj.ver1.loadTextGrid(
              obj,
              "up-down"
            );
            this.$store.dispatch("current/setTextGrid", textgrid);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          });
        } else if (payload.click == "TEXTGRID/TEXTGRID") {
          this.wavesurfer.loadTextGrid(file);
          this.$vuewer.snackbar.success("$vuetify.loaded");
        } else {
          this.$vuewer.snackbar.warning("$vuetify.notAcceptable");
        }
      }
    },
    onLoadeddata: function(payload) {
      if (payload) {
        this.$vuewer.console.log(this.tag, `on loaded`);
        this.videoElm = payload;
        this.$nextTick(() => {
          // 他コンポーネントで WS の操作を実施可能にする
          this.wavesurfer = this.$refs.wavesurfer;
          // レイアウトのリサイズ
          this.$refs.layout.onResize();
        });
      }
    },
    onFrameUpdated(payload) {
      this.$vuewer.console.log(this.tag, `on frame updated`);
      this.current.frame = payload;
      if (this.lazyRular) {
        this.dialog.ruler.show = true;
        this.lazyRular = false;
      }
      if (this.lazyImageEdit) {
        this.dialog.imageEdit.show = true;
        this.lazyImageEdit = false;
      }
    },
    onSpectrogramRenderStart() {
      this.$vuewer.console.log(this.tag, `on spectrogram render start`);
      this.isLoading = true;
    },
    onSpectrogramRenderEnd() {
      this.$vuewer.console.log(this.tag, `on spectrogram render end`);
      if (this.$textgrid) {
        this.isSyncing = true;
        this.$store.dispatch("current/setTextGrid", this.$textgrid);

        // start が指定されている場合そこに移動
        if (this.$route.query.start) {
          const time = Number(this.$route.query.start);
          this.$store.dispatch("current/seekTo", { time, center: false });
        }
        // current.tier を初期化
        this.current.tier.key = null;
        this.current.tier.values = [];
        this.current.tier.record.idx = 0;
        this.current.tier.record.text = "";
        this.current.tier.record.time = 0;
        this.$duration = this.wavesurfer ? this.wavesurfer.getDuration() : 0;
        this.isSyncing = false;
      }
      this.isLoading = false;
    },
    onTextGridClick: function(payload) {
      if (this.wavesurfer.isPlaying()) this.wavesurfer.pause();
      this.current.key = payload.key;
      this.current.time = payload.time;
      if (payload.ctrl) {
        if (this.$addRecordKey == "ctrl") {
          if (payload.detail == 1) this.addRecord(payload.key, payload.time);
        }
      }
      if (payload.alt) {
        if (this.$addRecordKey == "alt") {
          if (payload.detail == 1) this.addRecord(payload.key, payload.time);
        }
      }
      if (payload.item) {
        this.current.text = payload.item.text;
        this.current.time = payload.item.time;
      }
    },
    onTextGridDblClick: function(payload) {
      if (this.$addRecordKey == "dbl") {
        this.addRecord(payload.key, payload.time);
      }
    },
    // key 操作系
    onTextGridKeydown: function(payload) {
      const time = Number(Date.now() - this.keybuffer.time);
      const check = (this.keybuffer.from == "textgrid") & (time < 150);
      const preKey = check ? this.keybuffer.keycode : null;
      const { key, xKey } = this.$vuewer.key.summary(payload);

      const item = payload.current;

      // DELETE 系の動作
      if (~[8, 46].indexOf(key)) {
        if (this.$deleteRecordKey == xKey) {
          this.deleteRecord(item.key, item.index);
        }
        if (this.$deleteRecordKey + "+shift" == xKey) {
          this.onClickTierDelete();
        }
      } else if (key == 68) {
        if (preKey == null && xKey == "default") {
          // d で現在 Tier のテキストを削除
          this.deleteRecordText(item.key, item.index);
        } else if (preKey == 68 && xKey == "default") {
          // dd で現在 Tier の削除
          this.deleteTier(item.key);
        }
      }

      // Ctrl + SPACE で現在時刻にティアーを挿入
      if (key == 32 && xKey == "ctrl") {
        this.addRecord(item.key, this.wavesurfer.getCurrentTime(), "");
      }

      // タブキー時に現在時刻の再生
      if (key == 9 && xKey == "default") {
        this.playRecord(item.key, item.index);
      }

      if (key == 187 && xKey == "ctrl+shift") {
        // ctrl + で拡大
        this.$minPxPerSec = this.$minPxPerSec + 50;
      }
      if (key == 189 && xKey == "ctrl") {
        // ctrl - で拡大
        if (this.$minPxPerSec > 100) this.$minPxPerSec = this.$minPxPerSec - 50;
      }

      // 移動系操作
      if (~[37, 74].indexOf(key)) {
        if (xKey == "default") {
          // ← | j で 1 フレーム戻す
          this.wavesurfer.skipBackward();
        } else if (xKey == "ctrl") {
          // ctrl + ← | j で前のレコードに移動
          this.prevRecord(item.key, item.index, false);
        } else if (xKey == "ctrl+shift") {
          // ctrl + shift + ← | j で終端時刻を短くする
          this.shrinkRecord(item.key, item.index);
        } else if (xKey == "ctrl+alt") {
          // ctrl + alt + ← | j で現在レコードの先頭に移動
          this.toStartRecord(item.key, item.index);
        }
      } else if (~[38, 72].indexOf(key) && xKey == "default") {
        // ↑|h で上の Tier を選択
        this.prevTier();
      } else if (~[39, 75].indexOf(key)) {
        if (xKey == "default") {
          // →|k で 1 フレーム進める
          this.wavesurfer.skipForward();
        } else if (xKey == "ctrl") {
          // ctrl + →|k で次のレコードに移動
          this.nextRecord(item.key, item.index, false);
        } else if (xKey == "ctrl+shift") {
          // ctrl + shift + →|k で現在レコードを延長
          this.extendRecord(item.key, item.index);
        } else if (xKey == "ctrl+alt") {
          // ctrl + alt + →|k  で現在レコードの終端に移動
          this.toEndRecord(item.key, item.index);
        }
      } else if (~[40, 76].indexOf(key) && xKey == "default") {
        // ↓|l で下の TIER に移動
        this.nextTier();
      }
      if (key == 54 && xKey == "shift") {
        this.toStartRecord(item.key, item.index);
      } else if (key == 52 && xKey == "shift") {
        this.toEndRecord(item.key, item.index);
      }

      // ctrl + c でクリップボードにコピー
      if (key == 67 && xKey == "ctrl") {
        this.copyRecord(item.key, item.index);
      } else if (key == 67 && xKey == "ctrl+shift") {
        this.onClickTierAdd();
      }

      // ctrl + v でクリップボードにペースト
      if (key == 86 && xKey == "ctrl") {
        this.pasteRecord(item.key, item.index);
      }

      // ヤンク操作
      if (key == 89 && xKey == "default") {
        if (preKey == null) {
          // y のみで現在 Record のテキストをコピー
          this.copyRecord(item.key, item.index);
        } else if (preKey == 89) {
          // yy で現在 tier を全てコピー
          this.copyRecords(item.key);
        }
      } else if (key == 80 && xKey == "default") {
        this.paste();
      }
      // ctrl + s で明示的に保存
      if (key == 83 && xKey == "ctrl") {
        this.fireUpdateData();
      }
      // ctrl + z または u で Textgrid の状態を一つ戻す
      if ((key == 90 && xKey == "ctrl") || (key == 85 && xKey == "default")) {
        this.rebaseTextgrid();
      }

      // ctrl + r でドロップボックスからデータをリロード
      if (key == 82 && xKey == "ctrl") {
        this.onClickLoadDropbox();
      }

      if (key == 73 && xKey == "default") {
        if (preKey == 73) {
          // i i で画像編集
          this.onClickImageEdit();
        } else {
          // i でインサート
          this.$refs.input.focus();
        }
      }

      // o d で補完設定を開く
      if (preKey == 79 && key == 68 && xKey == "default") {
        this.onClickComplate();
      }

      // キーバッファを更新
      this.keybuffer.time = Date.now();
      this.keybuffer.from = "textgrid";
      this.keybuffer.keycode = payload.keycode;
      this.keybuffer.xKey = xKey;
    },
    onWaveSurferKeyup: function(event) {
      const { key, xKey } = this.$vuewer.key.summary(event);
      const item = {
        key: this.current.tier.key,
        idx: this.current.tier.record.idx || 0
      };
      if (key == "tab" && xKey == "default") {
        this.playPause();
      } else if (key == "j" && xKey == "default") {
        this.wavesurfer.skipBackward();
      } else if (key == "j" && xKey == "ctrl") {
        this.prevRecord(item.key, item.idx, false);
      } else if (key == "j" && xKey == "ctrl+shift") {
        this.shrinkRecord(item.key, item.idx);
      } else if (key == "j" && xKey == "ctrl+alt") {
        this.toStartRecord(item.key, item.idx);
      } else if (key == "k" && xKey == "default") {
        this.wavesurfer.skipForward();
      } else if (key == "k" && xKey == "ctrl") {
        this.nextRecord(item.key, item.idx, false);
      } else if (key == "k" && xKey == "ctrl+shift") {
        this.extendRecord(item.key, item.idx);
      } else if (key == "k" && xKey == "ctrl+alt") {
        this.toEndRecord(item.key, item.idx);
      } else if (key == "s" && xKey == "ctrl") {
        this.fireUpdateData();
      } else if (
        (key == "z" && xKey == "ctrl") ||
        (key == "u" && xKey == "default")
      ) {
        // ctrl + z または u で Textgrid の状態を一つ戻す
        this.rebaseTextgrid();
      } else if (key == "r" && xKey == "ctrl") {
        this.onClickLoadDropbox();
      } else if (key == "i" && xKey == "default") {
        this.focusRecord();
        setTimeout(() => {
          this.$refs.input.focus();
        });
      } else if (key == "i" && xKey == "ctrl+shift") {
        this.onClickImageEdit();
      } else if (key == "c" && xKey == "ctrl+shift") {
        this.onClickTierAdd();
      } else {
        console.log("onWaveSurferKeyup", key, xKey, event);
      }
    },
    onTableKeyup: function(event) {
      const { key, xKey } = this.$vuewer.key.summary(event);
      if (key == "s" && xKey == "ctrl") {
        this.fireUpdateData();
      } else if (key == "r" && xKey == "ctrl") {
        this.onClickLoadDropbox();
      } else if (key == "i" && xKey == "ctrl+shift") {
        this.onClickImageEdit();
      } else {
        console.log("onTableKeyup", key, xKey, event);
      }
    },
    onVideoArrayKeyup: function(payload) {
      const event = payload.event;
      const { key, xKey } = this.$vuewer.key.summary(event);
      const item = {
        key: this.current.tier.key,
        idx: this.current.tier.record.idx
      };

      if (key == "tab" && xKey == "default") {
        this.playPause();
      } else if (key == "j" && xKey == "default") {
        this.wavesurfer.skipBackward();
      } else if (key == "j" && xKey == "ctrl") {
        this.prevRecord(item.key, item.idx, false);
      } else if (key == "j" && xKey == "ctrl+shift") {
        this.shrinkRecord(item.key, item.idx);
      } else if (key == "j" && xKey == "ctrl+alt") {
        this.toStartRecord(item.key, item.idx);
      } else if (key == "k" && xKey == "default") {
        this.wavesurfer.skipForward();
      } else if (key == "k" && xKey == "ctrl + shift") {
        this.extendRecord(item.key, item.idx);
      } else if (key == "k" && xKey == "ctrl + alt") {
        this.toEndRecord(item.key, item.idx);
      } else if (key == "k" && xKey == "ctrl") {
        this.nextRecord(item.key, item.idx, false);
      } else if (key == "s" && xKey == "ctrl") {
        this.fireUpdateData();
      } else if (key == "r" && xKey == "ctrl") {
        this.onClickLoadDropbox();
      } else if (key == "i" && xKey == "ctrl+shift") {
        this.onClickImageEdit();
      } else {
        console.log("onVideoArrayKeyup", payload.ref, key, xKey, event);
      }
    },
    // TextField 操作
    onUpdateRecordText: function(opt) {
      const tier = this.current.tier;
      const key = tier.key;
      const idx = tier.record.idx;
      const record = this.$textgrid[key].values[idx];
      if (key) {
        const item = {
          time: record.time,
          text: tier.record.text
        };
        this.wavesurfer.setTierValue(key, idx, item);
        if (!this.isSyncing) {
          this.$vuewer.console.log(
            this.tag,
            `update text a record (key: ${key} idx: ${idx})`
          );
        }
        if (opt == "next") {
          this.nextRecord(key, idx, true);
        } else {
          this.onEscTextField();
        }
      }
    },
    onEscTextField: function() {
      const key = this.current.tier.key;
      setTimeout(() => {
        this.$refs.input.blur();
        if (key) this.focusTier(key);
      });
    },
    // 音声認識
    onVoiceUpdateRecordText: function() {
      const recog =
        window.webkitSpeechRecognition || window.SpeechRecognition || null;
      if (recog) {
        const rec = new recog();
        rec.lang = this.$vuetify.lang.current == "ja" ? "ja-JP" : "en-US";
        rec.onresult = e => {
          if (e.results[0].isFinal) {
            this.current.tier.record.text = e.results[0][0].transcript;
            this.onUpdateRecordText();
          }
        };
        rec.start();
      } else {
        this.$vuewer.snackbar.warn(
          this.$vuetify.lang.t("$vuetify.contexts.browserError")
        );
      }
    },
    onTextGridUpdate: function(textgrid) {
      if (textgrid) {
        const oldTierNum = this.$textgrid
          ? Object.keys(this.$textgrid).length
          : 0;
        const currentTierNum = Object.keys(this.$textgrid).length;
        if (!this.isSyncing) {
          this.$textgrid = Object.assign({}, textgrid);
          if (oldTierNum !== currentTierNum) {
            this.$store.commit("current/tab", currentTierNum);
          }
        }
      }
    },
    onRecordUpdated: function(payload) {
      // Tier 情報の登録
      this.current.tier.key = payload.key;
      this.current.tier.values = this.$textgrid[payload.key].values;

      // レコード情報の登録
      this.current.tier.record.idx = payload.index;
      if (payload.item) {
        this.current.tier.record.time = payload.item.time;
        this.current.tier.record.text = payload.item.text;
      } else {
        this.current.tier.record.time = 0;
        this.current.tier.record.text = "";
      }

      // 遅延処理
      if (this.lazyFocusTextField) {
        setTimeout(() => {
          this.$refs.input.focus();
        });
        this.lazyFocusTextField = false;
      }
    },
    // ffmpeg を用いたノイズ除去
    onClickNoiseReduction: function(payload) {
      setTimeout(() => {
        this.$emit("run-noise-reduction", payload);
      }, 100);
    },
    onClickDetail: function() {
      this.$vuewer.console.log(this.tag, `on click detail`);
      if (this.$store.state.current.layout.mini) {
        this.dialog.textgrid.show = true;
      } else {
        this.dialog.detail.show = true;
      }
    },
    onClickSetting: function() {
      this.$vuewer.console.log(this.tag, `on click setting`);
      this.dialog.setting.show = true;
    },
    onClickRuler: function(time) {
      this.$vuewer.console.log(this.tag, `on click ruler`);
      if (time) {
        this.lazyRular = true;
        this.$store.dispatch("current/seekTo", { time, center: false });
      } else {
        this.dialog.ruler.show = true;
      }
    },
    onClickImageEdit: function(time) {
      this.$vuewer.console.log(this.tag, `on click image edit`);
      if (time) {
        this.lazyImageEdit = true;
        this.$store.dispatch("current/seekTo", { time, center: false });
      } else {
        this.dialog.imageEdit.show = true;
      }
    },
    onClickTierAdd: function() {
      this.$vuewer.console.log(this.tag, `on click tier add`);
      this.dialog.tier.show = true;
    },
    onClickTierEdit: function() {
      this.$vuewer.console.log(this.tag, `on click tier edit`);
      this.dialog.tierEdit.show = true;
    },
    onClickTierDelete: function() {
      this.$vuewer.console.log(this.tag, `on click tier delete`);
      this.dialog.tierDelete.show = true;
    },
    onClickComplate: function() {
      this.$vuewer.console.log(this.tag, `on click complate`);
      this.dialog.complates.show = true;
    },
    onClickLoadDropbox: function() {
      const path = this.$store.getters["current/video/dropboxPath"];
      if (path !== null && this.$vuewer.dropbox.hasToken()) {
        this.$vuewer.loading.start("$vuetify.loading");
        this.$vuewer.dropbox
          .read(path)
          .then(text => {
            const obj = JSON.parse(text);
            this.$store.dispatch("current/loadObj", obj);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          })
          .catch(res => {
            let msg = `DROPBOX ERROR: ${res.status} :${res.error.error_summary}`;
            if (res.status == 409) {
              msg = "$vuetify.notFound";
            }
            this.$vuewer.snackbar.error(msg);
          })
          .finally(() => this.$vuewer.loading.end());
      } else {
        this.$vuewer.dropbox.auth();
      }
    },
    // context menu の record 関連処理
    onClickRecordContextMenu: function(payload) {
      if (this.current.tier.key) {
        const record = this.current.tier.record;
        const key = this.current.tier.key;
        if (payload == "play") {
          this.playRecord(key, record.idx);
        } else if (payload == "copy") {
          this.copyRecord(key, record.idx);
        } else if (payload == "paste") {
          this.pasteRecord(key, record.idx);
        } else if (payload == "next") {
          this.nextRecord(key, record.idx, false);
        } else if (payload == "prev") {
          this.prevRecord(key, record.idx, false);
        } else if (payload == "to-start") {
          // 現在レコードの始端に移動
          this.toStartRecord(key, record.idx);
        } else if (payload == "to-end") {
          // 現在レコードの終端に移動
          this.toEndRecord(key, record.idx);
        } else if (payload == "extend") {
          // 現在レコードを延長
          this.extendRecord(key, record.idx);
        } else if (payload == "shrink") {
          // 現在レコードを短縮
          this.shrinkRecord(key, record.idx);
        } else if (payload == "split-by-frames") {
          // レコード分割 (フレーム毎)
          this.splitRecord(key, record.idx, "frames");
        } else if (payload == "split-by-chars") {
          // レコード分割 (文字毎)
          this.splitRecord(key, record.idx, "chars");
        } else if (payload == "split-by-slash") {
          // レコード分割 (区切り文字毎: /)
          this.splitRecord(key, record.idx, "/");
        } else if (payload == "owakati") {
          this.tokenizeRecord(key, record.idx, payload);
        } else if (payload == "oyomi") {
          this.tokenizeRecord(key, record.idx, payload);
        } else if (payload == "opronunciation") {
          this.tokenizeRecord(key, record.idx, payload);
        } else if (payload == "obasic") {
          this.tokenizeRecord(key, record.idx, payload);
        } else if (payload == "opos") {
          this.tokenizeRecord(key, record.idx, payload);
        }
      } else {
        this.$vuewer.snackbar.warning("$vuetify.textgrid.tier.record.no");
      }
    },
    onClickIntervalContextMenu: function(payload) {
      const key = this.current.tier.key;
      if (key) {
        if (payload == "owakati") {
          this.tokenizeTier(key, payload);
        } else if (payload == "oyomi") {
          this.tokenizeTier(key, payload);
        } else if (payload == "opronunciation") {
          this.tokenizeTier(key, payload);
        } else if (payload == "time2frame") {
          const records = this.$textgrid[this.current.key].values;
          const rType = this.$textgrid[this.current.key].type;
          let new_records = records;
          if (rType == "interval") {
            records.map((r, i) => {
              const time = Math.round(r.time * this.$fps) * this.$frameRate;
              if (i == records.length - 1) {
                return { text: r.text, time: r.time };
              }
              return { text: r.text, time: time };
            });
          } else {
            new_records = records.map(r => {
              return {
                text: r.text,
                time: Math.round(r.time * this.$fps) * this.$frameRate
              };
            });
          }
          const textgrid = this.$textgrid;
          textgrid[key].values = new_records;
          this.$store.dispatch("current/setTextGrid", textgrid);
        }
      } else {
        this.$vuewer.snackbar.warning("$vuetify.textgrid.tier.record.no");
      }
    },

    // 特殊ボタンの操作
    onMouseover: function(where) {
      this.where = where;
    },
    // 進むボタンクリック時の操作
    onForwardBtnUp: function(payload) {
      if (payload.ctrl) {
        // ctrl + next で拡大
        this.$minPxPerSec = this.$minPxPerSec + 50;
      } else {
        if (this.where == "wave-surfer") {
          const key = this.current.tier.key;
          if (key) {
            const record = this.current.tier.record;
            this.nextRecord(key, record.idx, false);
          } else {
            this.wavesurfer.skipForward();
          }
        } else {
          this.wavesurfer.skipForward();
        }
      }
    },
    // 戻るボタンクリック時の操作
    onBackBtnUp: function(payload) {
      if (payload.ctrl) {
        if (this.$minPxPerSec > 100) {
          this.$minPxPerSec = this.$minPxPerSec - 50;
        }
      } else {
        if (this.where == "wave-surfer") {
          const key = this.current.tier.key;
          if (key) {
            const record = this.current.tier.record;
            this.prevRecord(key, record.idx, false);
          } else {
            this.wavesurfer.skipBackward();
          }
        } else {
          this.wavesurfer.skipBackward();
        }
      }
    },
    // 特殊ボタンの操作
    onLayoutMouseUp: function(e) {
      const vm = this;
      if (e.button == 1) {
        // 中ボタンが押された場合
        e.preventDefault();
        if (e.ctrlKey) {
          this.$store.commit("drawer", true);
        } else if (e.altKey) {
          this.$store.commit("logging/show", true);
        } else {
          this.fab = !this.fab;
        }
      } else if (e.button == 3) {
        // バックボタン制御
        e.preventDefault();
        e.stopPropagation();
        const payload = {
          ctrl: e.ctrlKey,
          meta: e.metaKey,
          alt: e.altKey,
          shift: e.shift
        };
        vm.onBackBtnUp(payload);
      } else if (e.button == 4) {
        e.preventDefault();
        e.stopPropagation();
        const payload = {
          ctrl: e.ctrlKey,
          meta: e.metaKey,
          alt: e.altKey,
          shift: e.shift
        };
        vm.onForwardBtnUp(payload);
      }
    }
  },
  mounted: async function() {
    this.$store.dispatch("search/show");
    await this.$store.dispatch("current/init", this.id);
    const layout = this.$refs.layout;
    if (layout) {
      const el = layout.$el;
      el.addEventListener("mouseup", this.onLayoutMouseUp, { passive: false });
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch("current/init");
    this.$store.dispatch("search/init");

    const layout = this.$refs.layout;
    const el = layout.$el;
    el.removeEventListener("mouseup", this.onLayoutMouseUp);
  }
};
</script>
<style scoped></style>
