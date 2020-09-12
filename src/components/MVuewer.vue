<template>
  <m-vuwer-layout ref="layout" @resize="onResize">
    <template v-slot:video>
      <m-video-array
        ref="videoArray"
        :src="src"
        :fps="fps"
        :frameOffset="frameOffset"
        :frames="$frames"
        :origin-size="originSize"
        @loadeddata="onLoadeddata"
        @frame-updated="onFrameUpdated"
        @mouseover="onMouseover('video-array')"
      />
      <m-vuwer-actions
        @download-click="onDownloadClick"
        @upload-click="onUploadClick"
        @mouseover="onMouseover('actions')"
        :fps="fps"
        v-if="wavesurfer"
      />
    </template>
    <template v-slot:table>
      <m-text-grid
        ref="tables"
        @click-image-edit="onClickImageEdit"
        @click-ruler="onClickRuler"
        @mouseover="onMouseover('tables')"
        :frames="$frames"
        :textgrid="$textgrid"
        :video-height="videoHeight"
      />
    </template>
    <v-card @mouseover="onMouseover('wave-surfer')">
      <m-w-context-menu
        @click-image-edit="onClickImageEdit"
        @click-tier-add="onClickTierAdd"
        @click-tier-edit="onClickTierEdit"
        @click-tier-delete="onClickTierDelete"
        @click-download="onDownloadClick"
        @click-complate="onClickComplate"
        @click-record="onClickRecordContextMenu"
      >
        <wave-surfer
          normalize
          responsive
          scrollParent
          showTextGrid
          splitChannels
          ref="wavesurfer"
          backend="MediaElement"
          textgrid-max-height="100px"
          :cursorColor="cursorColor"
          :drawingContextAttributes="drawingContextAttributes"
          :freqRate="freqRate"
          :minPxPerSec="minPxPerSec"
          :showFreqLabel="showFreqLabel"
          :showSpectrogram="showSpectrogram"
          :showTimeLine="showTimeLine"
          :skipLength="skipLength"
          :source="videoElm"
          :spectrogramHeight="spectrogramHeight"
          :targetChannel="targetChannel"
          :waveColor="waveColor"
          :progressColor="progressColor"
          @spectrogram-render-end="onSpectrogramRenderEnd"
          @spectrogram-render-start="onSpectrogramRenderStart"
          @textgrid-click="onTextGridClick"
          @textgrid-current-update="onRecordUpdated"
          @textgrid-dblclick="onTextGridDblClick"
          @textgrid-keydown="onTextGridKeydown"
          @textgrid-update="onTextGridUpdate"
        >
          <template v-slot:textform>
            <v-text-field
              dense
              hide-details
              outlined
              autocomplete="on"
              label="text"
              list="complates"
              ref="input"
              v-if="showTextField"
              v-model="current.tier.record.text"
              :disabled="current.tier.key == null"
              @keydown.enter="onUpdateRecordText"
              @keydown.tab="onUpdateRecordText('next')"
              @keydown.ctrl.219="onEscTextField"
              @keydown.27.prevent="onEscTextField"
            />
            <datalist id="complates">
              <option v-for="x in complates" :key="x"> {{ x }} </option>
            </datalist>
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
      </m-w-context-menu>
    </v-card>

    <template v-slot:bottom>
      <m-speed-dial
        v-model="fab"
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
        :src="current.frame.src"
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
      <m-tier-dialog v-model="dialog.tier.show" :tiers="tiers" />
      <m-tier-edit-dialog v-model="dialog.tierEdit.show" :tiers="tiers" />
      <m-tier-delete-dialog v-model="dialog.tierDelete.show" :tiers="tiers" />
      <m-ruler-dialog
        v-if="originSize.width"
        v-model="dialog.ruler.show"
        :origin-size="originSize"
        :src="current.frame.src"
      />
      <m-image-edit-dialog
        v-if="current.frame.src"
        v-model="dialog.imageEdit.show"
        @rects-updated="onRectsUpdated"
        @points-updated="onPointsUpdated"
        @rect-deleted="onRectDeleted"
        @point-deleted="onPointDeleted"
        :frame="current.frame"
        :src="current.frame.src"
        :origin-size="originSize"
      />
      <m-complates-dialog v-model="dialog.complates.show" />
    </template>
  </m-vuwer-layout>
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
import MSettingMixin from "@/mixins/MSettingMixin";
import MSnackbarMixin from "@/mixins/MSnackbarMixin";
import io from "@/io";
import math from "@/utils/math";

export default {
  name: "WVuwer",
  mixins: [MSettingMixin, MSnackbarMixin],
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
    MVuwerActions
  },
  props: {
    /**
     * 解析対象の動画ソース
     */
    src: {
      type: String,
      required: true
    },
    /**
     * 解析対象の動画の fps
     */
    fps: {
      type: Number,
      required: true
    },
    // 動画オリジナルサイズ
    originSize: {
      type: Object,
      required: true
    },
    // 既存アノテーション情報
    textgrid: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 各種画像アノテーション結果
    frames: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // スキップ時に何フレーム分をスキップするか
    frameOffset: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    videoElm: null, // WS のレンダ対象
    videoHeight: null, // ビデオ表示領域の最大幅
    isLoading: false, // WS がレンダ中か否か
    isSyncing: false, // 過去データを反映中か否か
    lazyRular: false, // 時刻変更後にルーラーダイアログを起動
    lazyImageEdit: false, // 時刻変更後に画像編集ダイアログを起動
    lazyFocusTextField: false, // 時刻変更後にText field にフォーカスする
    minPxPerSec: 100,
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
        i: null, // 現在フレーム番号
        time: null, // 現在フレーム時刻
        src: null, // 現在フレーム画像
        points: [],
        rects: [],
        texts: []
      }
    },
    tiers: [],
    complates: []
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
    $textgrid: {
      get() {
        return this.$store.state.current.textgrid;
      },
      set(val) {
        this.$store.commit("current/textGrid", val);
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
    // fps の逆数
    frameRate: function() {
      return 1 / this.fps;
    },
    // スキップ時の長さ
    skipLength: function() {
      return this.frameOffset * this.frameRate;
    },
    // 転記階層記入欄を表示するか否か
    showTextField: function() {
      if (this.videoElm) {
        if (this.$textgrid) {
          if (!this.isLoading) {
            return Object.keys(this.$textgrid).length > -1;
          }
        }
      }
      return false;
    }
  },
  watch: {
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
      if ((val > 100) & (val < 500)) {
        if (val % 50 == 0) {
          this.wavesurfer.zoom(val);
        }
      }
    },
    current: {
      handler: function(val) {
        if (val.key) {
          this.complates =
            this.$store.state.current.complates.complates[val.key] || [];
        }
      },
      deep: true
    }
  },
  methods: {
    // レコード操作
    addRecord: function(key, time, text = "") {
      const item = { time: time, text: text };
      this.wavesurfer.addTierValue(key, item);
    },
    deleteRecord: function(key, idx) {
      if (idx > -1) {
        this.wavesurfer.deleteTierValue(key, idx);
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
          const d = this.wavesurfer.getDuration();
          const offset = this.playOffset * this.frameRate;
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
    pasteRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      const vm = this;
      if (navigator.clipboard) {
        navigator.clipboard.readText().then(function(text) {
          const item = {
            time: target.time,
            text: text
          };
          vm.wavesurfer.setTierValue(key, idx, item);
          vm.current.tier.record.text = text;
        });
      }
    },
    nextRecord(key, idx, focus) {
      if (idx + 1 < this.$textgrid[key].values.length) {
        const next = this.$textgrid[key].values[idx + 1];
        if (next) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, next);
          this.seekTo(next.time, true);
        }
      } else {
        const next = this.$textgrid[key].values[0];
        if (next) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, next);
          this.seekTo(next.time, true);
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
          this.seekTo(prev.time, true);
        }
      } else {
        const values = this.$textgrid[key].values;
        const prev = this.$textgrid[key].values[values.length - 1];
        if (prev) {
          if (focus) this.lazyFocusTextField = true;
          const tg = this.wavesurfer.wavesurfer.textgrid;
          tg.setCurrent(key, prev);
          this.seekTo(prev.time, true);
        }
      }
    },
    toStartRecord(key, idx) {
      // 現在レコードの始端に移動
      if (this.$textgrid[key].type == "interval") {
        if (idx - 1 > -1) {
          const prev = this.$textgrid[key].values[idx - 1];
          this.seekTo(prev.time, true);
        }
      } else {
        const target = this.$textgrid[key].values[idx];
        this.seekTo(target.time, true);
      }
      this.focusTier(key);
    },
    toEndRecord(key, idx) {
      // 現在レコードの終端に移動
      const target = this.$textgrid[key].values[idx];
      this.seekTo(target.time, true);
      this.focusTier(key);
    },
    extendRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      const d = this.wavesurfer.getDuration();
      const time = target.time + this.frameRate;
      if (time < d) {
        const item = { text: target.text, time: time };
        this.wavesurfer.setTierValue(key, idx, item);
        this.seekTo(time);
      }
    },
    shrinkRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      const type = this.$textgrid[key].type;
      const time = target.time - this.frameRate;
      if (time > 0) {
        const item = { text: target.text, time: time };
        if (
          type == "interval" &&
          idx == this.$textgrid[key].values.length - 1
        ) {
          return;
        } else {
          this.wavesurfer.setTierValue(key, idx, item);
          this.seekTo(time);
        }
      }
    },
    splitRecord(key, idx, type) {
      const tier = this.$textgrid[key];
      const target = tier.values[idx];
      if (tier.type == "interval") {
        const prev = idx - 1 == 0 ? tier.values[0] : tier.values[idx - 1];
        if (type == "frames") {
          // フレーム分割
          let time = prev.time;
          while (time < target.time - this.frameRate) {
            time = time + this.frameRate;
            this.addRecord(key, time);
          }
        } else if (type == "chars") {
          // 文字別分割
          const num = target.text.length;
          const duration = target.time - prev.time;
          const offset = duration / num;
          for (let i = 1; i < num; i++) {
            const time = prev.time + offset * i;
            this.addRecord(key, time, target.text[i]);
          }

          const item = {
            time: target.time,
            text: target.text[num - 1]
          };
          this.wavesurfer.setTierValue(key, idx + num - 1, item);
        } else {
          // 区切り文字分割
          const texts = target.text.split(type);
          const num = texts.length;
          const duration = target.time - prev.time;
          const offset = duration / num;
          for (let i = 1; i < num; i++) {
            const time = prev.time + offset * i;
            this.addRecord(key, time, texts[i]);
          }
          const item = {
            time: target.time,
            text: texts[num - 1]
          };
          this.wavesurfer.setTierValue(key, idx + num - 1, item);
        }
      }
    },
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
          const target = math.nearest(
            this.$textgrid[key].values,
            "time",
            this.wavesurfer.getCurrentTime()
          );
          tg.setCurrent(key, target);
        }
        tg.tiers[key].canvas.focus();
      });
    },

    seekTo: function(time, center) {
      const d = this.wavesurfer.getDuration();
      const p = time / d;
      const progress = p > 1 ? 1 : p < 0 ? 0 : p;
      if (center) {
        this.wavesurfer.seekAndCenter(progress);
      } else {
        this.wavesurfer.seekTo(progress);
      }
    },

    // EVENT ハンドラー
    onResize: function(payload) {
      this.videoHeight = payload;
    },
    onDownloadClick: function(payload) {
      const bname = this.$store.state.current.video.filename.split(".")[0];
      if (payload == "XLSX") {
        const obj = {
          records: this.$store.getters["current/tgTable"],
          frames: this.$store.getters["current/frameTable"],
          points: this.$store.getters["current/pointTable"],
          rects: this.$store.getters["current/rectTable"]
        };
        const blob = io.xlsx.dump(obj);
        io.file.download(blob, `${bname}.xlsx`);
      } else if (payload == "TEXTGRID/JSON") {
        const blob = new Blob([JSON.stringify(this.$textgrid, null, "  ")], {
          type: "application/json"
        });
        io.file.download(blob, `${bname}-records.json`);
      } else if (payload == "TEXTGRID/TEXTGRID") {
        this.wavesurfer.downloadTextGrid(`${bname}.TextGrid`);
      } else if (payload == "TEXTGRID/XLSX") {
        const obj = {
          records: this.$store.getters["current/tgTable"]
        };
        const blob = io.xlsx.dump(obj);
        io.file.download(blob, `${bname}-records.xlsx`);
      } else if (payload == "FRAME/JSON") {
        const blob = new Blob([JSON.stringify(this.$frames, null, "  ")], {
          type: "application/json"
        });
        io.file.download(blob, `${bname}-frame.json`);
      } else if (payload == "FRAME/XLSX") {
        const obj = {
          frames: this.$store.getters["current/frameTable"],
          points: this.$store.getters["current/pointTable"],
          rects: this.$store.getters["current/rectTable"]
        };
        const blob = io.xlsx.dump(obj);
        io.file.download(blob, `${bname}.xlsx`);
      } else {
        const msg = `${payload} の処理は未実装です`;
        this.showWarning(msg);
      }
    },
    onUploadClick: function(payload) {
      if (payload.click == "JSON") {
        const msg = `${payload.click} is not working yet!!`;
        this.showWarning(msg);
      } else if (payload.click == "TEXTGRID") {
        this.wavesurfer.loadTextGrid(payload.files[0]);
        const msg = `${payload.click} is loaded!!`;
        this.showSuccess(msg);
      } else {
        const msg = `${payload.click} is not accepted!!`;
        this.showWarning(msg);
      }
    },
    onLoadeddata: function(payload) {
      if (payload) {
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
      this.isLoading = true;
    },
    onSpectrogramRenderEnd() {
      if (this.textgrid) {
        if (this.current.frame.i == null) {
          this.isSyncing = true;
          for (const key in this.textgrid) {
            this.wavesurfer.addTier(key, this.textgrid[key].type);
            for (const val of this.textgrid[key].values) {
              if (val) this.wavesurfer.addTierValue(key, val);
            }
          }
          // start が指定されている場合そこに移動
          const start = Number(this.$route.query.start);
          if (start) {
            this.seekTo(start);
          }
          // current.tier を初期化
          this.current.tier.key = null;
          this.current.tier.values = [];
          this.current.tier.record.idx = 0;
          this.current.tier.record.text = "";
          this.current.tier.record.time = 0;
          this.isSyncing = false;
        }
      }
      this.isLoading = false;
    },
    onTextGridClick: function(payload) {
      if (this.wavesurfer.isPlaying()) this.wavesurfer.pause();
      this.current.key = payload.key;
      this.current.time = payload.time;
      if (payload.ctrl) {
        if (this.addRecordKey == "ctrl") {
          if (payload.detail == 1) this.addRecord(payload.key, payload.time);
        }
      }
      if (payload.alt) {
        if (this.addRecordKey == "alt") {
          if (payload.detail == 1) this.addRecord(payload.key, payload.time);
        }
      }
      if (payload.item) {
        this.current.text = payload.item.text;
        this.current.time = payload.item.time;
      }
    },
    onTextGridDblClick: function(payload) {
      if (this.addRecordKey == "dbl") {
        this.addRecord(payload.key, payload.time);
      }
    },
    onTextGridKeydown: function(payload) {
      const item = payload.current;

      // DELETE 系の動作
      if (payload.keycode == 8 || payload.keycode == 46) {
        if (this.deleteRecordKey == "alt") {
          if (payload.alt) this.deleteRecord(item.key, item.index);
        } else if (this.deleteRecordKey == "ctrl") {
          if (payload.ctrl) this.deleteRecord(item.key, item.index);
        } else {
          this.deleteRecord(item.key, item.index);
        }
      }

      // Ctrl + SPACE で現在時刻にティアーを挿入
      if (payload.keycode == 32 && payload.ctrl) {
        this.addRecord(item.key, this.wavesurfer.getCurrentTime(), "");
      }

      // タブキー時に現在時刻の再生
      if (payload.keycode == 9) {
        this.playRecord(item.key, item.index);
      }

      // ctrl + で拡大
      if (payload.keycode == 187 && payload.shift) {
        if (payload.ctrl == true) {
          if (this.$minPxPerSec < 500) {
            this.$minPxPerSec = this.$minPxPerSec + 50;
          }
        }
      }
      if (payload.keycode == 189 && payload.shift) {
        if (payload.ctrl == true) {
          if (this.$minPxPerSec > 100) {
            this.$minPxPerSec = this.$minPxPerSec - 50;
          }
        }
      }

      // ← で1フレーム戻す
      if (payload.keycode == 37) {
        if (payload.ctrl) {
          if (payload.shift) {
            // ctrl + shift + ← で現在レコードを縮小
            this.shrinkRecord(item.key, item.index);
          } else if (payload.alt) {
            // ctrl + alt + ← で現在レコードの始端に移動
            this.toStartRecord(item.key, item.index);
          } else {
            // ctrl + ← で前レコードに移動
            this.prevRecord(item.key, item.index, false);
          }
        } else {
          this.wavesurfer.skipBackward();
        }
      }
      // ↑ で上の Tier に移動
      if (payload.keycode == 38) {
        this.prevTier();
      }
      // → で1フレーム進める
      if (payload.keycode == 39) {
        if (payload.ctrl) {
          if (payload.shift) {
            // → + ctrl + shift で現在レコードを延長
            this.extendRecord(item.key, item.index);
          } else if (payload.alt) {
            // → + ctrl + alt で現在レコードの終端に移動
            this.toEndRecord(item.key, item.index);
          } else {
            // → + ctrl で次のレコードに移動
            this.nextRecord(item.key, item.index, false);
          }
        } else {
          this.wavesurfer.skipForward();
        }
      }
      // ↓ で上の Tier に移動
      if (payload.keycode == 40) {
        this.nextTier();
      }

      // ctrl + c でクリップボードにコピー
      if (payload.keycode == 67 && payload.ctrl == true) {
        this.copyRecord(item.key, item.index);
      }

      // ctrl + v でクリップボードにペースト
      if (payload.keycode == 86 && payload.ctrl == true) {
        this.pasteRecord(item.key, item.index);
      }

      // VIM モード
      if (payload.keycode == 74) {
        if (payload.ctrl) {
          if (payload.shift) {
            // ctrl + shift + j で現在レコードを縮小
            this.shrinkRecord(item.key, item.index);
          } else if (payload.alt) {
            // ctrl + alt + j で現在レコードの始端に移動
            this.toStartRecord(item.key, item.index);
          } else {
            // ctrl + j で前レコードに移動
            this.prevRecord(item.key, item.index, false);
          }
        } else {
          // j で前フレームに移動
          this.wavesurfer.skipBackward();
        }
      }
      if (payload.keycode == 75) {
        if (payload.ctrl) {
          if (payload.shift) {
            // k + ctrl + shift で現在レコードを延長
            this.extendRecord(item.key, item.index);
          } else if (payload.alt) {
            // k + ctrl + alt で現在レコードの終端に移動
            this.toEndRecord(item.key, item.index);
          } else {
            // k + ctrl で次のレコードに移動
            this.nextRecord(item.key, item.index, false);
          }
        } else {
          // k で次フレームに移動
          this.wavesurfer.skipForward();
        }
      }
      if (payload.keycode == 76) {
        // l で下の Tier をフォーカス
        this.nextTier();
      }
      if (payload.keycode == 72) {
        // h で上の Tier をフォーカス
        this.prevTier();
      }
      if (payload.keycode == 73) {
        // i でフォーカス: 73
        setTimeout(() => this.$refs.input.focus());
      }
    },
    onUpdateRecordText: function(opt) {
      const tier = this.current.tier;
      const key = tier.key;
      if (key) {
        const item = {
          time: tier.record.time,
          text: tier.record.text
        };
        const idx = this.current.tier.record.idx;
        this.wavesurfer.setTierValue(key, idx, item);
        if (opt == "next") {
          this.nextRecord(key, idx, true);
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
    onTextGridUpdate: function(textgrid) {
      if (textgrid) {
        this.$textgrid = Object.assign({}, textgrid);
        if (!this.isSyncing) {
          this.$emit("textgrid-updated", this.$textgrid);
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
    onClickDetail: function() {
      if (this.$store.state.current.layout.mini) {
        this.dialog.textgrid.show = true;
      } else {
        this.dialog.detail.show = true;
      }
    },
    onClickSetting: function() {
      this.dialog.setting.show = true;
    },
    onClickRuler: function(payload) {
      if (payload) {
        this.lazyRular = true;
        this.seekTo(payload);
      } else {
        this.dialog.ruler.show = true;
      }
    },
    onClickImageEdit: function(payload) {
      if (payload) {
        this.lazyImageEdit = true;
        this.seekTo(payload);
      } else {
        this.dialog.imageEdit.show = true;
      }
    },
    onClickTierAdd: function() {
      this.dialog.tier.show = true;
    },
    onClickTierEdit: function() {
      this.dialog.tierEdit.show = true;
    },
    onClickTierDelete: function() {
      this.dialog.tierDelete.show = true;
    },
    onClickComplate: function() {
      this.dialog.complates.show = true;
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
        }
      } else {
        this.showWarning("No record was selected!");
      }
    },
    onPointsUpdated: function(points) {
      this.current.frame.points = points;
      this.$store.dispatch("current/updateFrame", this.current.frame);
      this.$emit("frame-point-updated", this.current.frame);
    },
    onRectsUpdated: function(rects) {
      this.current.frame.rects = rects;
      this.$store.dispatch("current/updateFrame", this.current.frame);
      this.$emit("frame-rect-updated", this.current.frame);
    },
    onPointDeleted: function(point) {
      const i = this.current.frame.points.findIndex(x => x.id == point.id);
      if (i !== -1) {
        this.current.frame.points.splice(i, 1);
        this.$store.dispatch("current/updateFrame", this.current.frame);
        this.$emit("frame-point-deleted", point);
      }
    },
    onRectDeleted: function(rect) {
      const i = this.current.frame.rects.findIndex(x => x.id == rect.id);
      if (i !== -1) {
        this.current.frame.rects.splice(i, 1);
        this.$store.dispatch("current/updateFrame", this.current.frame);
        this.$emit("frame-rect-deleted", rect);
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
        if (this.$minPxPerSec < 500) {
          this.$minPxPerSec = this.$minPxPerSec + 50;
        }
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
          this.$store.commit("setDrawer", true);
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
  mounted: function() {
    this.$frames = [];
    this.$frames = this.frames;
    this.minPxPerSec = this.$minPxPerSec;
    this.$store.dispatch("search/show");

    const layout = this.$refs.layout;
    if (layout) {
      const el = layout.$el;
      el.addEventListener("mouseup", this.onLayoutMouseUp, {
        passive: false
      });
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
