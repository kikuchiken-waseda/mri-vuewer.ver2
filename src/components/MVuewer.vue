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
        @resize="onResize"
        @loadeddata="onLoadeddata"
        @frame-updated="onFrameUpdated"
      />
      <m-vuwer-actions
        @download-click="onDownloadClick"
        @upload-click="onUploadClick"
        :fps="fps"
        v-if="wavesurfer"
      />
    </template>
    <template v-slot:table>
      <m-text-grid
        @click-image-edit="onClickImageEdit"
        @click-ruler="onClickRuler"
        :frames="$frames"
        :textgrid="$textgrid"
        :video-height="videoHeight"
      />
    </template>

    <v-card>
      <wave-surfer
        ref="wavesurfer"
        backend="MediaElement"
        splitChannels
        normalize
        responsive
        scrollParent
        showTextGrid
        textgrid-max-height="100px"
        :drawingContextAttributes="drawingContextAttributes"
        :source="videoElm"
        :skipLength="skipLength"
        :minPxPerSec="minPxPerSec"
        :freqRate="freqRate"
        :targetChannel="targetChannel"
        :spectrogramHeight="spectrogramHeight"
        :showTimeLine="showTimeLine"
        :showSpectrogram="showSpectrogram"
        :showFreqLabel="showFreqLabel"
        :cursorColor="cursorColor"
        :waveColor="waveColor"
        :progressColor="progressColor"
        @spectrogram-render-start="onSpectrogramRenderStart"
        @spectrogram-render-end="onSpectrogramRenderEnd"
        @textgrid-click="onTextGridClick"
        @textgrid-dblclick="onTextGridDblClick"
        @textgrid-update="onTextGridUpdate"
        @textgrid-current-update="onTextGridCurrentUpdate"
        @textgrid-keydown="onTextGridKeydown"
      >
        <template v-slot:textform>
          <v-text-field
            dense
            hide-details
            outlined
            ref="input"
            label="text"
            v-if="showTextField"
            v-model="current.tier.item.text"
            :disabled="current.tier.key == null"
            @keydown.enter="onUpdateRecordText"
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
import MDetailDialog from "@/components/dialogs/MDetailDialog";
import MTierDialog from "@/components/dialogs/MTierDialog";
import MTierEditDialog from "@/components/dialogs/MTierEditDialog";
import MTierDeleteDialog from "@/components/dialogs/MTierDeleteDialog";
import MRulerDialog from "@/components/dialogs/MRulerDialog";
import MImageEditDialog from "@/components/dialogs/MImageEditDialog";
import MSettingDialog from "@/components/dialogs/MSettingDialog";
import MSpeedDial from "@/components/MSpeedDial";
import MSettingMixin from "@/mixins/MSettingMixin";
import MSnackbarMixin from "@/mixins/MSnackbarMixin";
import io from "@/io";

export default {
  name: "WVuwer",
  mixins: [MSettingMixin, MSnackbarMixin],
  components: {
    MVuwerLayout,
    MVideoArray,
    MTextGrid,
    WaveSurfer,
    MSpeedDial,
    MDetailDialog,
    MTierDialog,
    MTierEditDialog,
    MTierDeleteDialog,
    MRulerDialog,
    MImageEditDialog,
    MSettingDialog,
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
    lazyRular: false,
    lazyImageEdit: false,
    minPxPerSec: 100,
    drawingContextAttributes: {
      desynchronized: false
    },
    dialog: {
      detail: { show: false },
      tier: { show: false },
      tierEdit: { show: false },
      tierDelete: { show: false },
      ruler: { show: false },
      imageEdit: { show: false },
      setting: { show: false }
    },
    current: {
      // 現在フォーカスが当たっている TIER 情報
      tier: {
        key: null, // 現在フォーカスされている Tier 名
        time: 0, // フォーカスが決定した箇所の時刻
        // 現在選択されている TIER ITEM
        item: {
          idx: 0,
          text: "",
          time: 0
        },
        values: []
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
          return Object.keys(this.$textgrid).length > -1;
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
    }
  },
  methods: {
    addRecord: function(key, time) {
      const item = { time: time, text: "" };
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
    skipForwardRecord(key, idx) {
      const target = this.$textgrid[key].values[idx];
      const d = this.wavesurfer.getDuration();
      const time = target.time + this.frameRate;
      if (time < d) {
        const item = { text: target.text, time: time };
        this.wavesurfer.setTierValue(key, idx, item);
      }
    },
    skipBackwardRecord(key, idx) {
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
        }
      }
    },
    seekTo: function(time) {
      const d = this.wavesurfer.getDuration();
      const p = time / d;
      const progress = p > 1 ? 1 : p < 0 ? 0 : p;
      this.wavesurfer.seekTo(progress);
    },
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
            this.wavesurfer.seekTo(start / this.wavesurfer.getDuration());
          }
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
      // タブキー時に現在時刻の再生
      if (payload.keycode == 9) {
        this.playRecord(item.key, item.index);
      }
      // ← で1フレーム戻す
      if (payload.keycode == 37) {
        if (payload.ctrl) {
          this.skipBackwardRecord(item.key, item.index);
        } else {
          this.wavesurfer.skipBackward();
        }
      }
      // → で1フレーム進める
      if (payload.keycode == 39) {
        if (payload.ctrl) {
          this.skipForwardRecord(item.key, item.index);
        } else {
          this.wavesurfer.skipForward();
        }
      }
    },
    onUpdateRecordText: function() {
      const tier = this.current.tier;
      const key = tier.key;
      const item = {
        time: tier.item.time,
        text: tier.item.text
      };
      const idx = this.current.tier.item.idx;
      this.wavesurfer.setTierValue(key, idx, item);
    },
    onTextGridUpdate: function(textgrid) {
      if (textgrid) {
        this.$textgrid = Object.assign({}, textgrid);
        if (!this.isSyncing) {
          this.$emit("textgrid-updated", this.$textgrid);
        }
      }
    },
    onTextGridCurrentUpdate: function(payload) {
      this.current.tier.key = payload.key;
      this.current.tier.item.idx = payload.index;
      if (payload.item) {
        this.current.tier.item.time = payload.item.time;
        this.current.tier.item.text = payload.item.text;
      } else {
        this.current.tier.item.time = 0;
        this.current.tier.item.text = "";
      }
    },
    onClickDetail: function() {
      this.dialog.detail.show = true;
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
    }
  },
  mounted: function() {
    this.$frames = [];
    this.$frames = this.frames;
    this.minPxPerSec = this.$minPxPerSec;
    this.$store.dispatch("search/show");
  },
  beforeDestroy: function() {
    this.$store.dispatch("current/init");
    this.$store.dispatch("search/init");
  }
};
</script>

<style scoped></style>
