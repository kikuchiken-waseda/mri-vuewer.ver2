<template>
  <v-card ref="card" class="mx-auto" color="grey">
    <v-toolbar dense>
      <v-btn-toggle v-model="mode" dense group color="primary">
        <v-btn text>
          <v-icon>mdi-shape-circle-plus</v-icon>
        </v-btn>
        <v-btn text>
          <v-icon>mdi-shape-rectangle-plus</v-icon>
        </v-btn>
        <v-btn text>
          <v-icon>mdi-eraser</v-icon>
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
                draggable: true
              }"
              @click="onPointClick"
              @mouseenter="onPointMouseEnter"
              @mouseleave="onPointMouseLeave"
              @dragstart="onPointDragStart"
              @dragend="onPointDragEnd"
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
                draggable: true
              }"
              @click="onRectClick"
              @dragstart="onRectDragStart"
              @dragend="onRectDragEnd"
              @transformend="onTransformEnd"
            />
            <v-transformer ref="transformer" />
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
  data: () => ({
    color: "#F44336",
    size: 5,
    mode: 0,
    scale: 0,
    canvasMaxHeight: 600,
    background: {
      image: null
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
      this.$emit("keyup", payload);
    },
    onDblClick: function() {
      this.cursor = this.$refs.stage.getNode().getPointerPosition();
      // 点を追加
      if (this.mode == 0) {
        this.addPoint(this.cursor.x, this.cursor.y, this.color, this.size);
      }
      if (this.mode == 1) {
        const width = this.canvas.width / 5;
        const height = this.canvas.height / 5;
        this.addRect(
          this.cursor.x - width / 2,
          this.cursor.y - height / 2,
          width,
          height,
          0,
          this.color,
          this.size
        );
      }
    },
    onPointClick: function(e) {
      // ポイントがクリックされた場合, mode が 2 であればデータを削除する
      if (this.mode == 2) {
        const i = e.target.index;
        setTimeout(() => this.$emit("point-deleted", this.points[i]));
        this.points.splice(i, 1);
      }
    },
    onRectClick: function(e) {
      // ポイントがクリックされた場合, mode が 2 であればデータを削除する
      if (this.mode == 2) {
        const i = e.target.index;
        this.$emit("rect-deleted", this.rects[i]);
        this.rects.splice(i, 1);
      }
    },
    onPointMouseEnter: function(e) {
      // ポイントにマウスが入った場合, 強調を行う
      const i = e.target.index;
      if (this.mode == 2) {
        this.points[i].size = this.size + 2;
      }
    },
    onPointMouseLeave: function(e) {
      // ポイントからマウスが離れた場合, 強調を解除する
      const i = e.target.index;
      if (this.mode == 2) {
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
        this.rects[idx].width = e.target.width();
        this.rects[idx].scaleX = e.target.scaleX();
        this.rects[idx].height = e.target.height();
        this.rects[idx].scaleY = e.target.scaleY();
        this.emitUpdateRects();
      }
    },
    updateTransformer() {
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
    },
    onUpdatePoint: function(point) {
      const i = this.points.findIndex(x => x.id == point.id);
      this.points[i].label = point.label;
      this.points[i].color = point.color;
      this.emitUpdatePoints();
    },
    onUpdateRect: function(rect) {
      const i = this.rects.findIndex(x => x.id == rect.id);
      this.rects[i].label = rect.label;
      this.rects[i].color = rect.color;
      this.emitUpdateRects();
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
