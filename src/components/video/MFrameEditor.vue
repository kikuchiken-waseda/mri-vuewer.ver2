<template>
  <v-card ref="card" class="mx-auto" color="grey">
    <v-toolbar dense>
      <v-btn-toggle v-model="mode" dense group color="primary">
        <v-btn :value="m.val" text v-for="m in modes" :key="m.val">
          <v-icon>{{ m.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
      <div class="mx-1"></div>

      <m-color-menu icon v-model="color" />
      <v-spacer />

      <v-btn-toggle dense group color="primary">
        <v-btn icon @click="skipPrev">
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn icon @click="skipNext">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-btn-toggle>

      <v-btn-toggle dense group color="primary">
        <v-btn text @click="zoomOut">
          <v-icon>mdi-magnify-minus</v-icon>
        </v-btn>
        <v-btn text @click="zoomIn">
          <v-icon>mdi-magnify-plus</v-icon>
        </v-btn>
      </v-btn-toggle>

      <v-btn text @click="downloadImage">
        png <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card
      flat
      class="overflow-y-auto"
      :style="`max-height: ${canvasMaxHeight}px`"
    >
      <m-key-context ref="context" @keyup="onKeyup">
        <v-stage
          ref="stage"
          :config="canvas"
          @mousedown="onStageMouseDown"
          @touchstart="onStageMouseDown"
        >
          <v-layer ref="layer">
            <v-image @dblclick="onDblClick" :config="background" />
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
                  ruler.active == x.id
                    ? ruler.conf.activeSize
                    : ruler.conf.size,
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
              @dragstart="onRectDragStart"
              @dragend="onRectDragEnd"
              @transformend="onTransformEnd"
            />
            <v-transformer v-if="mode == 'rect'" ref="transformer" />
          </v-layer>

          <v-layer ref="layer">
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
          </v-layer>
        </v-stage>
      </m-key-context>
    </v-card>
    <v-tabs v-model="tab" fixed-tabs background-color="primary" dark>
      <v-tab> Points </v-tab>
      <v-tab> Rects </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <m-point-table
          :points="points"
          :origin-size="originSize"
          :canvas-size="canvas"
          @update-point="onUpdatePoint"
        />
      </v-tab-item>
      <v-tab-item>
        <m-rect-table
          :rects="rects"
          :origin-size="originSize"
          :canvas-size="canvas"
          @update-rect="onUpdateRect"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import MColorMenu from "@/components/menus/MColorMenu";
import MPointTable from "@/components/table/MPointTable";
import MRectTable from "@/components/table/MRectTable";
import MKeyContext from "@/components/contextmenus/MKeyContext";
import db from "@/storage/db";
export default {
  name: "m-frame-editor",
  mixins: [MWavesurferMixin],
  components: {
    MKeyContext,
    MColorMenu,
    MPointTable,
    MRectTable
  },
  props: {
    src: {
      type: String,
      required: true
    },
    frame: {
      type: Object
    },
    originSize: {
      type: Object
    }
  },
  computed: {
    modes: function() {
      return [
        { val: "circ", icon: "mdi-shape-circle-plus" },
        { val: "rect", icon: "mdi-shape-rectangle-plus" },
        { val: "ruler", icon: "mdi-ruler-square" },
        { val: "eras", icon: "mdi-eraser" }
      ];
    }
  },
  data: () => ({
    color: "#F44336",
    size: 5,
    mode: "circ",
    scale: 0,
    canvasMaxHeight: 600,
    background: {
      image: null
    },
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
    points: [],
    rects: [],
    selectedShapeName: "",
    canvas: {
      width: 600,
      height: 600
    },
    cursor: { x: null, y: null, show: false },
    tab: null
  }),
  methods: {
    focus: function() {
      this.$refs.context.focus();
    },
    blur: function() {
      this.$refs.context.blur();
    },
    zoomIn: function() {
      if (this.scale < 0) this.scale = 0;
      const cw = this.$refs.card.$el.clientWidth || 500;
      const $cw = cw + 100 * this.scale;
      if ($cw < 1000) {
        this.scale = this.scale + 0.5;
        this.loadImage(this.src);
      }
    },
    zoomOut: function() {
      if (this.scale > 0) this.scale = 0;
      const cw = this.$refs.card.$el.clientWidth || 500;
      const $cw = cw + 100 * this.scale;
      if ($cw > 300) {
        this.scale = this.scale - 0.5;
        this.loadImage(this.src);
      }
    },
    skipNext: function() {
      this.skipForward();
      this.$emit("skip");
    },
    skipPrev: function() {
      this.skipBackward();
      this.$emit("skip");
    },
    loadImage: function(val) {
      const img = new Image();
      img.src = val;
      img.onload = () => {
        this.onResize();
        this.background.image = img;
        this.syncPoints();
        this.syncRects();
        this.focus();
      };
    },
    downloadImage: function() {
      const name = `file-${this.frame.fileId}-frame-${this.frame.idx}.png`;
      const stage = this.$refs.stage.getStage();
      const dataURL = stage.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = name;
      link.click();
    },
    syncPoints: function() {
      this.points = [];
      if (this.frame) {
        const cw = this.canvas.width;
        const ow = this.originSize.width;
        const ch = this.canvas.height;
        const oh = this.originSize.height;
        for (const p of this.frame.points || []) {
          this.points.push({
            id: p.id || this.frame.points.length + 1,
            label: p.label || `point-${p.id}`,
            x: (p.x * cw) / ow,
            y: (p.y * ch) / oh,
            size: p.size,
            color: p.color
          });
        }
      }
    },
    syncRects: function() {
      this.rects = [];
      if (this.frame) {
        const cw = this.canvas.width;
        const ow = this.originSize.width;
        const ch = this.canvas.height;
        const oh = this.originSize.height;
        for (const r of this.frame.rects || []) {
          this.rects.push({
            id: r.id || this.frame.rects.length,
            name: `rect-${r.id || this.frame.rects.length}`,
            label: r.label || `rect-${r.id}`,
            x: (r.x * cw) / ow,
            y: (r.y * ch) / oh,
            width: (r.width * cw) / ow,
            height: (r.height * ch) / oh,
            rotation: r.rotation || 1,
            scaleX: r.scaleX || 1,
            scaleY: r.scaleY || 1,
            size: r.size,
            color: r.color
          });
        }
      }
    },
    emitUpdatePoints: function() {
      const ow = this.originSize.width;
      const oh = this.originSize.width;
      const cw = this.canvas.width;
      const ch = this.canvas.height;
      setTimeout(() => {
        const points = this.points.map(item => {
          return {
            id: item.id,
            label: item.label,
            x: (item.x / cw) * ow,
            y: (item.y / ch) * oh,
            size: item.size,
            color: item.color
          };
        });
        this.$emit("points-updated", points);
      }, 1);
    },
    emitUpdateRects: function() {
      const ow = this.originSize.width;
      const oh = this.originSize.width;
      const cw = this.canvas.width;
      const ch = this.canvas.height;
      setTimeout(() => {
        const rects = this.rects.map(item => {
          return {
            id: item.id,
            label: item.label,
            x: (item.x / cw) * ow,
            y: (item.y / ch) * oh,
            width: (item.width / cw) * ow,
            height: (item.height / ch) * oh,
            rotation: item.rotation || 1,
            scaleX: item.scaleX || 1,
            scaleY: item.scaleY || 1,
            size: item.size,
            color: item.color
          };
        });
        this.$emit("rects-updated", rects);
      }, 1);
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
      const f2 = { x: this.canvas.width, y: this.canvas.width * t + i };

      const points = [f1.x, f1.y, f2.x, f2.y];
      const id = this.ruler.lines.length;
      this.ruler.lines.push({ id, points, t, i });
    },
    addPoint: async function(x, y, color, size) {
      const item = {
        id: this.points.length + 1,
        label: `point-${this.points.length + 1}`,
        x: x,
        y: y,
        size: size,
        color: color
      };
      if (this.frame.id) {
        const count = await db.points.count();
        item.id = count + 1;
        item.label = `points-${count + 1}`;
      }
      this.points.push(item);
      this.emitUpdatePoints();
    },
    addRect: async function(x, y, width, height, rotation, color, size) {
      const item = {
        id: this.rects.length + 1,
        name: `rect-${this.rects.length + 1}`,
        label: `rect-${this.rects.length + 1}`,
        x: x,
        y: y,
        width: width,
        height: height,
        rotation: rotation,
        size: size,
        color: color
      };
      if (this.frame.id) {
        const count = await db.rects.count();
        item.id = count + 1;
        item.name = `rect-${count + 1}`;
        item.label = `rect-${count + 1}`;
      }
      this.rects.push(item);
      this.emitUpdateRects();
    },
    onResize: function() {
      const cw = this.$refs.card.$el.clientWidth || 500;
      const ch = (this.originSize.height * cw) / this.originSize.width;
      const $cw = cw + 100 * this.scale;
      const $ch = ch + 100 * this.scale;
      this.canvas.width = $cw;
      this.canvas.height = $ch;
      this.background.height = $cw;
      this.background.width = $ch;
      this.canvasMaxHeight = ch - (64 + 64);
    },
    // キー操作
    onKeyup: function(payload) {
      console.log("FrameEditor:onKeyup", payload);
      const { key, xKey } = this.$vuewer.key.summary(payload);
      if (key == "Tab" && xKey == "default") {
        const idx = this.modes.findIndex(x => x.val == this.mode);
        if (idx + 1 == this.modes.length) {
          this.mode = this.modes[0].val;
        } else {
          this.mode = this.modes[idx + 1].val;
        }
      }
      this.$emit("keyup", payload);
    },
    // image 系イベントハンドラ
    onDblClick: function() {
      this.cursor = this.$refs.stage.getNode().getPointerPosition();
      if (this.mode == "circ") {
        this.addPoint(this.cursor.x, this.cursor.y, this.color, this.size);
      } else if (this.mode == "rect") {
        const width = this.canvas.width / 5;
        const height = this.canvas.height / 5;
        const x = this.cursor.x - width / 2;
        const y = this.cursor.y - height / 2;
        this.addRect(x, y, width, height, 0, this.color, this.size);
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
        const width = this.canvas.width / 5;
        const height = this.canvas.height / 5;
        const x = e.evt.offsetX;
        const y = e.evt.offsetY;
        const r = (line.t * 180) / Math.PI;
        console.log(r * 180, Math.PI);
        this.addRect(x, y, width, height, r, this.color, this.size);
      } else {
        this.addPoint(e.evt.offsetX, e.evt.offsetY, this.color, this.size);
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
        const i = e.target.index;
        this.$emit("point-deleted", this.points[i]);
        this.points.splice(i, 1);
      }
    },
    onPointMouseEnter: function(e) {
      const i = e.target.index;
      if (this.mode == "eras" || this.mode == "circ") {
        this.points[i].size = this.size + 2;
      }
    },
    onPointMouseLeave: function(e) {
      const i = e.target.index;
      if (this.mode == "eras" || this.mode == "circ") {
        this.points[i].size = this.size;
      }
    },
    onPointDragStart: function(e) {
      const i = e.target.index;
      this.points[i].size = this.size + 2;
      this.points[i].opacity = 0.5;
    },
    onPointDragEnd: function(e) {
      const i = e.target.index;
      this.points[i].x = e.target.x();
      this.points[i].y = e.target.y();
      this.points[i].opacity = 1;
      this.points[i].size = this.size;
      this.emitUpdatePoints();
    },
    onUpdatePoint: function(point) {
      const i = this.points.findIndex(x => x.id == point.id);
      this.points[i].label = point.label;
      this.points[i].color = point.color;
      this.emitUpdatePoints();
    },
    // Rect 系イベントハンドラ
    onRectClick: function(e) {
      if (this.mode == "circ") {
        this.addPoint(e.evt.offsetX, e.evt.offsetY, this.color, this.size);
      } else if (this.mode == "eras") {
        const i = e.target.index;
        this.$emit("rect-deleted", this.rects[i]);
        this.rects.splice(i, 1);
      }
    },
    onRectDragStart: function(e) {
      const i = e.target.index;
      this.rects[i].opacity = 0.5;
    },
    onRectDragEnd: function(e) {
      const i = e.target.index;
      this.rects[i].x = e.target.x();
      this.rects[i].y = e.target.y();
      this.rects[i].opacity = 1;
      this.emitUpdateRects();
    },
    onUpdateRect: function(rect) {
      const i = this.rects.findIndex(x => x.id == rect.id);
      this.rects[i].label = rect.label;
      this.rects[i].color = rect.color;
      this.emitUpdateRects();
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
        this.rects[idx].rotation = e.target.rotation();
        console.log(e.target.rotation());
        this.rects[idx].width = e.target.width();
        this.rects[idx].scaleX = e.target.scaleX();
        this.rects[idx].height = e.target.height();
        this.rects[idx].scaleY = e.target.scaleY();
        this.emitUpdateRects();
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
    mode: function(val) {
      if (val == undefined) this.mode = 0;
    },
    src: function(val) {
      if (val) {
        this.scale = 0;
        this.loadImage(val);
      }
    }
  },
  mounted: function() {
    this.scale = 0;
    this.loadImage(this.src);
  }
};
</script>

<style scoped></style>
