<template>
  <m-frame-editor-layout ref="layout">
    <template v-slot:toolbar>
      <m-frame-editor-actions
        @skip="onSkip"
        @zoom="onZoom"
        @download="onDownload"
      />
    </template>
    <m-key-context ref="context" @keyup="onKeyup">
      <v-stage
        ref="stage"
        :config="{
          width: cw,
          height: ch
        }"
        @mousemove="onStageMouseMove"
        @mousedown="onStageMouseDown"
        @touchstart="onStageMouseDown"
      >
        <v-layer ref="layer">
          <v-image
            ref="background"
            @dblclick="onDblClick"
            :config="background"
          />
        </v-layer>
        <v-layer ref="layer">
          <v-circle
            v-for="(x, i) in ruler.points"
            :key="i"
            :config="{
              x: x.x,
              y: x.y,
              stroke: 'white',
              strokeWidth: 1,
              radius: ruler.conf.size,
              fill: ruler.conf.color
            }"
          />
        </v-layer>
        <v-layer ref="layer">
          <v-line
            v-for="(x, i) in ruler.lines"
            :key="i"
            :config="{
              points: x.points,
              stroke:
                ruler.active == x.id
                  ? ruler.conf.activeColor
                  : ruler.conf.color,
              strokeWidth:
                ruler.active == x.id ? ruler.conf.activeSize : ruler.conf.size,
              lineCap: 'round',
              lineJoin: 'round',
              dash: [5, 10]
            }"
            @mouseenter="onRulerMouseEnter"
            @mouseleave="onRulerMouseLeave"
            @click="onRulerClick"
          />
        </v-layer>
        <v-layer ref="layer">
          <v-rect
            v-for="x in rects"
            :key="x.name"
            :config="{
              name: x.name,
              x: x.x,
              y: x.y,
              width: x.width,
              height: x.height,
              rotation: x.rotation || 1,
              scaleX: x.scaleX || 1,
              scaleY: x.scaleY || 1,
              stroke: x.color,
              strokeWidth: x.size || 1,
              opacity: x.opacity || 1,
              draggable: mode == 'rect'
            }"
            @click="onRectClick"
            @dragend="onRectDragEnd"
            @transformend="onTransformEnd"
          />
          <v-circle
            v-for="(x, i) in points"
            :key="i"
            :config="{
              x: x.x,
              y: x.y,
              stroke: 'white',
              strokeWidth: 1,
              opacity: x.opacity || 1,
              radius: x.size,
              fill: x.color,
              draggable: mode == 'circ'
            }"
            @click="onPointClick"
            @mouseenter="onPointMouseEnter"
            @mouseleave="onPointMouseLeave"
            @dragstart="onPointDragStart"
            @dragend="onPointDragEnd"
          />
          <v-transformer v-if="mode == 'rect'" ref="transformer" />
        </v-layer>
        <v-layer v-if="cursor.show" ref="layer">
          <v-line
            :config="{
              points: [this.cursor.x || 0, 0, this.cursor.x || 0, this.ch],
              stroke: cursor.color,
              strokeWidth: 1,
              lineCap: 'round',
              lineJoin: 'round',
              dash: [2, 5]
            }"
          />
          <v-line
            :config="{
              points: [0, this.cursor.y || 0, this.cw, this.cursor.y || 0],
              stroke: cursor.color,
              strokeWidth: 1,
              lineCap: 'round',
              lineJoin: 'round',
              dash: [2, 5]
            }"
          />
        </v-layer>
      </v-stage>
    </m-key-context>
    <template v-slot:table>
      <m-frame-editor-tab
        :rects="rects"
        :points="points"
        :origin-size="{ width: ow, height: oh }"
        :canvas-size="{ width: cw, height: ch }"
        @update-point="$store.dispatch('current/frame/updatePoint', $event)"
        @update-rect="$store.dispatch('current/frame/updateRect', $event)"
      />
    </template>
  </m-frame-editor-layout>
</template>
<script>
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import MFrameEditorTab from "@/components/tab/MFrameEditorTab";
import MFrameEditorLayout from "@/components/layouts/MFrameEditorLayout";
import MFrameEditorActions from "@/components/actions/MFrameEditorActions";
import MKeyContext from "@/components/contextmenus/MKeyContext";
export default {
  name: "m-frame-editor",
  mixins: [MWavesurferMixin],
  components: {
    MKeyContext,
    MFrameEditorLayout,
    MFrameEditorActions,
    MFrameEditorTab
  },
  props: {
    height: {
      type: String,
      default: "100%"
    }
  },
  computed: {
    src: {
      get() {
        return this.$store.state.current.frame.src;
      },
      set(val) {
        this.$store.commit("current/frame/src", val);
      }
    },
    id: function() {
      return this.$store.state.current.frame.id;
    },
    idx: function() {
      return this.$store.state.current.frame.idx;
    },
    cw: function() {
      return this.$store.state.current.frame.cw;
    },
    ch: function() {
      return this.$store.state.current.frame.ch;
    },
    ow: function() {
      return this.$store.state.current.frame.ow;
    },
    oh: function() {
      return this.$store.state.current.frame.oh;
    },
    points: function() {
      return this.$store.getters["current/frame/points"];
    },
    rects: function() {
      return this.$store.getters["current/frame/rects"];
    },
    mode: function() {
      return this.$store.state.current.frame.mode;
    },
    filter: function() {
      return this.$store.state.current.frame.filter;
    },
    color: function() {
      return this.$store.state.current.frame.color;
    },
    isPointReserved: function() {
      // 入力予定の点群が存在するか
      return this.$store.state.current.frameConf.points.length > 0;
    },
    isRectReserved: function() {
      // 入力予定の矩形が存在するか
      return this.$store.state.current.frameConf.rects.length > 0;
    },
    cardHeight: function() {
      if (this.$store.state.current.layout.mini) {
        return "100%";
      }
      return "80vh";
    }
  },
  data: () => ({
    scale: 0,
    background: {
      image: null
    },
    reservedPoints: [],
    reservedRects: [],
    ruler: {
      active: null,
      conf: {
        size: 3,
        color: "#607D8B",
        activeSize: 5,
        activeColor: "#FFC107"
      },
      points: [],
      lines: []
    },
    selectedShapeName: "",
    cursor: { x: null, y: null, show: false, color: "#00B8D4" },
    tab: null
  }),
  methods: {
    focus: function() {
      this.$refs.context.focus();
    },
    blur: function() {
      this.$refs.context.blur();
    },
    loadImage: async function(src) {
      let $src = src;
      if (this.filter) {
        $src = await this.filter(src, { width: this.ow, height: this.oh });
      }
      const img = await this.$vuewer.io.image.load($src);
      this.onResize();
      this.background.image = img;
      this.focus();
    },
    copyImage: async function() {
      const stage = this.$refs.stage.getStage();
      const dataURL = stage.toDataURL();
      const blob = this.$vuewer.io.file.toBlob(dataURL);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
    },
    addRulerPoint: function(x, y) {
      const id = this.ruler.points.length + 1;
      const label = `ruler-point-${id}`;
      this.ruler.points.push({ id, label, x, y });
      if (id % 2 == 0) this.addRulerLine(id);
    },
    addRulerLine(pid) {
      const idx = this.ruler.points.findIndex(x => x.id == pid);
      const a = this.ruler.points[idx - 1];
      const b = this.ruler.points[idx];

      const t = (b.y - a.y) / (b.x - a.x);
      const i = a.y - t * a.x;

      const f1 = { x: 0, y: i };
      const f2 = { x: this.cw, y: this.cw * t + i };

      const points = [f1.x, f1.y, f2.x, f2.y];
      const id = this.ruler.lines.length;
      this.ruler.lines.push({ id, points, t, i });
    },
    addPoint: function(x, y, color) {
      const item = { x, y, color };
      if (this.isPointReserved) {
        const tmp = this.reservedPoints.shift();
        if (tmp) {
          item.label = tmp.label;
          item.color = tmp.color;
          this.$store.dispatch("current/frame/addPoint", item);
        }
      } else {
        item.lapel = `points-${this.points.length}`;
        this.$store.dispatch("current/frame/addPoint", item);
      }
    },
    addRect: async function(x, y, width, height, rotation, color) {
      let item = { x, y, width, height, rotation, color };
      if (this.isRectReserved) {
        const tmp = this.reservedRects.shift();
        if (tmp) {
          item.name = tmp.label;
          item.label = tmp.label;
          item.color = tmp.color;
          this.$store.dispatch("current/frame/addRect", item);
        }
      } else {
        const name = `rect-${this.rects.length + 1}`;
        item.name = name;
        item.label = name;
        this.$store.dispatch("current/frame/addRect", item);
      }
    },
    onSkip: function(payload) {
      if (payload == "next") {
        this.skipForward();
      } else {
        this.skipBackward();
      }
      this.$emit("skip");
    },
    onZoom: function(payload) {
      if (payload == "out") {
        if (this.scale > 0) this.scale = 0;
        const cw = this.$refs.layout.getWidth();
        const $cw = cw + 100 * this.scale;
        if ($cw > 300) {
          this.scale = this.scale - 0.5;
          this.loadImage(this.src);
        }
      } else {
        if (this.scale < 0) this.scale = 0;
        const cw = this.$refs.layout.getWidth();
        const $cw = cw + 100 * this.scale;
        if ($cw < 1000) {
          this.scale = this.scale + 0.5;
          this.loadImage(this.src);
        }
      }
    },
    onDownload: function(payload) {
      if (payload == "image") {
        const bname = this.$store.state.current.video.filename.split(".")[0];
        const name = `${bname}-f${this.idx}.png`;
        const stage = this.$refs.stage.getStage();
        const dataURL = stage.toDataURL();
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = name;
        link.click();
      }
    },
    onResize: function() {
      const cw = this.$refs.layout.getWidth();
      const ch = (this.oh * cw) / this.ow;
      const $cw = cw + 100 * this.scale;
      const $ch = ch + 100 * this.scale;

      this.$store.commit("current/frame/cw", $cw);
      this.$store.commit("current/frame/ch", $ch);

      this.background.height = $cw;
      this.background.width = $ch;
    },
    // キー操作
    onKeyup: function(payload) {
      console.log("FrameEditor:onKeyup", payload);
      const { key, xKey } = this.$vuewer.key.summary(payload);
      if (key == "tab" && xKey == "default") {
        // TAB でモード変更
        // const idx = this.modes.findIndex(x => x.val == this.mode);
        // if (idx + 1 == this.modes.length) {
        //   this.mode = this.modes[0].val;
        // } else {
        //   this.mode = this.modes[idx + 1].val;
        // }
      } else if (key == "c" && xKey == "ctrl") {
        // ctrl + c で現在画像をクリップボードに挿入
        this.copyImage();
      } else if (key == "s" && xKey == "ctrl") {
        // ctrl + s で現在画像をダウンロード
        this.downloadImage();
      } else if (key == "i" && xKey == "default") {
        // i でキーボード操作に切り替え
        this.cursor.show = true;
      } else if (key == "[" && xKey == "ctrl") {
        // ctrl + [ でキーボード操作を抜ける
        this.cursor.show = false;
      } else if (key == "Escape" && xKey == "default") {
        // ect でキーボード操作を抜ける
        this.cursor.show = false;
      } else if (key == "j" && xKey == "default") {
        if (this.cursor.show) this.cursor.x = this.cursor.x - this.cw / 100;
      } else if (key == "j" && xKey == "ctrl") {
        if (this.cursor.show) this.cursor.y = this.cursor.y - this.ch / 100;
      } else if (key == "k" && xKey == "default") {
        if (this.cursor.show) this.cursor.x = this.cursor.x + this.cw / 100;
      } else if (key == "k" && xKey == "ctrl") {
        if (this.cursor.show) this.cursor.y = this.cursor.y + this.ch / 100;
      } else if (key == " " && xKey == "default") {
        if (this.cursor.show) this.onDblClick();
      } else {
        this.$emit("keyup", payload);
      }
    },
    // image 系イベントハンドラ
    onDblClick: function() {
      if (this.mode == "circ") {
        this.addPoint(this.cursor.x, this.cursor.y, this.color);
      } else if (this.mode == "rect") {
        const width = this.cw / 5;
        const height = this.ch / 5;
        const x = this.cursor.x - width / 2;
        const y = this.cursor.y - height / 2;
        this.addRect(x, y, width, height, 0, this.color);
      } else if (this.mode == "ruler") {
        this.addRulerPoint(this.cursor.x, this.cursor.y);
      }
    },
    // Ruler 系イベントハンドラ
    onRulerClick: function(e) {
      const i = e.target.index;
      const line = this.ruler.lines[0];
      if (this.mode == "eras") {
        const a = this.ruler.points.findIndex(p => p.x == line.points[0]);
        const b = this.ruler.points.findIndex(p => p.x == line.points[2]);
        this.ruler.points.splice(a, 1);
        this.ruler.points.splice(b, 1);
        this.ruler.lines.splice(i, 1);
      } else if (this.mode == "rect") {
        const width = this.cw / 5;
        const height = this.ch / 5;
        const x = e.evt.offsetX;
        const y = e.evt.offsetY;
        const r = (line.t * 180) / Math.PI;
        this.addRect(x, y, width, height, r, this.color);
      } else {
        this.addPoint(e.evt.offsetX, e.evt.offsetY, this.color);
      }
    },
    onRulerMouseEnter: function(e) {
      const i = e.target.index;
      this.ruler.active = this.ruler.lines[i].id;
    },
    onRulerMouseLeave: function() {
      this.ruler.active = null;
    },
    // Point 系イベントハンドラ
    onPointClick: function(e) {
      if (this.mode == "eras") {
        this.$store.dispatch(
          "current/frame/deletePoint",
          this.points[e.target.index].id
        );
      }
    },
    onPointMouseEnter: function(e) {
      if (this.mode == "eras" || this.mode == "circ") {
        this.$store.dispatch(
          "current/frame/activePoint",
          this.points[e.target.index].id
        );
      }
    },
    onPointMouseLeave: function(e) {
      if (this.mode == "eras" || this.mode == "circ") {
        const point = this.points[e.target.index];
        this.$store.dispatch("current/frame/inactivePoint", point.id);
      }
    },
    onPointDragStart: function(e) {
      const point = this.points[e.target.index];
      this.$store.dispatch("current/frame/activePoint", point.id);
    },
    onPointDragEnd: function(e) {
      const i = e.target.index;
      const point = this.points[i];
      point.x = e.target.x();
      point.y = e.target.y();
      this.$store.dispatch("current/frame/updatePoint", point);
    },
    // Rect 系イベントハンドラ
    onRectClick: function(e) {
      if (this.mode == "circ") {
        this.addPoint(e.evt.offsetX, e.evt.offsetY, this.color);
      } else if (this.mode == "eras") {
        this.$store.dispatch(
          "current/frame/deleteRect",
          this.rects[e.target.index].id
        );
      }
    },
    onRectDragEnd: function(e) {
      const rect = this.rects[e.target.index];
      rect.x = e.target.x();
      rect.y = e.target.y();
      this.$store.dispatch("current/frame/updateRect", rect);
    },
    onStageMouseMove() {
      const cursor = this.$refs.stage.getNode().getPointerPosition();
      this.cursor.x = cursor.x;
      this.cursor.y = cursor.y;
    },
    onStageMouseDown(e) {
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();
        return;
      }
      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }
      const name = e.target.name();
      const rect = this.rects.find(r => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = "";
      }
      this.updateTransformer();
    },
    onTransformEnd(e) {
      const idx = this.rects.findIndex(r => r.name == this.selectedShapeName);
      if (idx !== -1) {
        const rect = this.rects[idx];
        rect.rotation = e.target.rotation();
        rect.width = e.target.width();
        rect.scaleX = e.target.scaleX();
        rect.height = e.target.height();
        rect.scaleY = e.target.scaleY();
        this.$store.dispatch("current/frame/updateRect", rect);
      }
    },
    updateTransformer() {
      if (this.mode == "rect") {
        const transformerNode = this.$refs.transformer.getNode();
        const stage = transformerNode.getStage();
        const { selectedShapeName } = this;
        const selectedNode = stage.findOne("." + selectedShapeName);
        if (selectedNode === transformerNode.node()) {
          return;
        }
        if (selectedNode) {
          transformerNode.nodes([selectedNode]);
        } else {
          transformerNode.nodes([]);
        }
        transformerNode.getLayer().batchDraw();
      }
    },
    close: function() {
      this.scale = 0;
    }
  },
  watch: {
    "$store.state.current.frameConf.points": function(val) {
      this.reservedPoints = JSON.parse(JSON.stringify(val));
    },
    "$store.state.current.frameConf.rects": function(val) {
      this.reservedRects = JSON.parse(JSON.stringify(val));
    },
    filter: function(val, old) {
      if (val != old) {
        this.loadImage(this.src);
      }
    },
    src: function(val) {
      if (val) {
        // 元画像が変更されたタイミングで拡大比を戻す
        this.scale = 0;
        // 元画像が変更されたタイミングで予約ポイントが存在するかを確認
        this.reservedPoints = JSON.parse(
          JSON.stringify(this.$store.state.current.frameConf.points)
        );
        this.reservedRects = JSON.parse(
          JSON.stringify(this.$store.state.current.frameConf.rects)
        );
        // 動画をキャンバスに読み込み
        this.loadImage(val);
      }
    }
  },
  mounted: function() {
    this.scale = 0;
    this.reservedPoints = JSON.parse(
      JSON.stringify(this.$store.state.current.frameConf.points)
    );
    this.reservedRects = JSON.parse(
      JSON.stringify(this.$store.state.current.frameConf.rects)
    );

    this.loadImage(this.src);
  }
};
</script>

<style scoped></style>
