<template>
  <v-card ref="card" class="mx-auto" color="grey">
    <v-toolbar dense>
      <v-btn-toggle v-model="mode" dense group color="primary">
        <v-btn text>
          <v-icon>mdi-map-marker-distance</v-icon>
        </v-btn>
        <v-btn text>
          <v-icon>mdi-map-marker</v-icon>
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
      <v-btn text @click="downloadSheet">
        xlsx <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card
      flat
      class="overflow-y-auto"
      :style="`max-height: ${canvasMaxHeight}px`"
    >
      <v-stage @dblclick="onDblClick" ref="stage" :config="canvas">
        <v-layer ref="layer">
          <v-image :config="background" />
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
              fill: x.color
            }"
            @click="onPointClick"
            @mouseenter="onPointMouseEnter"
            @mouseleave="onPointMouseLeave"
          />
        </v-layer>
        <v-layer v-if="mode != 1" ref="layer">
          <v-line
            v-for="(x, i) in lines"
            :key="i"
            @click="onLineClick"
            @mouseenter="onLineMouseEnter"
            @mouseleave="onLineMouseLeave"
            :config="{
              points: x.points,
              stroke: x.color,
              strokeWidth: x.size,
              lineCap: 'round',
              lineJoin: 'round',
              dash: [5, 10]
            }"
          />
        </v-layer>
      </v-stage>
    </v-card>

    <v-tabs v-model="tab" fixed-tabs background-color="primary" dark>
      <v-tab> Points </v-tab>
      <v-tab> Distance </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <m-point-table
          show-frame
          :points="points"
          :origin-size="originSize"
          :canvas-size="canvas"
          @update-point="onUpdatePoint"
        />
      </v-tab-item>
      <v-tab-item>
        <m-line-table
          show-frame
          :lines="lines"
          :origin-size="originSize"
          :canvas-size="canvas"
          @update-line="onUpdateLine"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import MPointTable from "@/components/table/MPointTable";
import MLineTable from "@/components/table/MLineTable";
import MColorMenu from "@/components/menus/MColorMenu";
export default {
  name: "m-ruler-editor",
  mixins: [MWavesurferMixin],
  components: {
    MColorMenu,
    MPointTable,
    MLineTable
  },
  props: {
    originSize: {
      type: Object
    }
  },
  data: () => ({
    mode: 0,
    color: "#F44336",
    oldColors: ["#FF7043", "#FF8A65", "#FFAB91", "#FFCCBC", "#FBE9E7"],
    canvasMaxHeight: 600,
    size: 5,
    scale: 0,
    widthRate: 0,
    heightRate: 0,
    tab: null,
    points: [],
    lines: [],
    background: { image: null },
    canvas: { width: 600, height: 600 },
    mouse: { x: null, y: null }
  }),
  computed: {
    src() {
      return this.$store.state.current.frame.src;
    },
    id() {
      return this.$store.state.current.frame.id;
    },
    idx() {
      return this.$store.state.current.frame.idx;
    },
    time() {
      return this.$store.state.current.frame.time;
    }
  },
  methods: {
    // 全体操作
    close: function() {
      this.scale = 0;
      this.points = [];
      this.lines = [];
    },
    downloadImage: function() {
      const bname = this.$store.state.current.video.filename.split(".")[0];
      const name = `${bname}-f${this.idx}.png`;
      const stage = this.$refs.stage.getStage();
      const dataURL = stage.toDataURL();
      this.$vuewer.download.url(dataURL, name);
    },
    downloadSheet: function() {
      const ow = this.originSize.width;
      const oh = this.originSize.height;
      const cw = this.canvas.width;
      const ch = this.canvas.height;

      const points = [["label", "frame", "time", "x", "y", "color"]];
      for (const p of this.points || []) {
        const row = [
          p.label,
          p.frame.idx,
          p.frame.time,
          Math.round((p.x / cw) * ow),
          Math.round((p.y / ch) * oh),
          p.color
        ];
        points.push(row);
      }

      const lines = [
        ["label", "frame", "time", "x1", "y1", "x2", "y2", "distance", "color"]
      ];
      for (const l of this.lines || []) {
        const p1 = { x: (l.points[0] / cw) * ow, y: (l.points[1] / ch) * oh };
        const p2 = { x: (l.points[2] / cw) * ow, y: (l.points[3] / ch) * oh };
        const distance = this.$vuewer.math.distance(p1, p2);
        const row = [
          l.label,
          l.frame.idx,
          l.frame.time,
          p1.x,
          p1.y,
          p2.x,
          p2.y,
          distance,
          l.color
        ];
        lines.push(row);
      }
      const obj = { points: points, lines: lines };
      const blob = this.$vuewer.io.xlsx.dump(obj);
      const bname = this.$store.state.current.video.filename.split(".")[0];
      this.$vuewer.download.blob(blob, `${bname}-measurement.xlsx`);
    },
    skipNext: function() {
      this.skipForward();
      this.$emit("skip");
    },
    skipPrev: function() {
      this.skipBackward();
      this.$emit("skip");
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
      if ($cw > 500) {
        this.scale = this.scale - 0.5;
        this.loadImage(this.src);
      }
    },
    // 点データ操作
    addPoint: async function(x, y, color, size) {
      const item = {
        mode: this.mode,
        id: this.points.length + 1,
        label: `point-${this.points.length + 1}`,
        frame: { time: this.time, idx: this.idx },
        x: x,
        y: y,
        size: size,
        color: color
      };
      if (this.id) {
        const count = this.points.length;
        item.id = count + 1;
        item.label = `points-${count + 1}`;
      }
      this.points.push(item);
    },
    onPointClick: function(e) {
      if (this.mode == 2) {
        const i = e.target.index;
        if (this.points[i].mode == 0) {
          const idx = this.lines.findIndex(x => x.ref[0] == i || x.ref[1] == i);
          this.points.splice(this.lines[idx].ref[0], 2);
          this.lines.splice(idx, 1);
        } else {
          this.points.splice(i, 1);
        }
      }
    },
    onPointMouseEnter: function(e) {
      const i = e.target.index;
      if (this.mode == 2) {
        this.points[i].size = this.size + 2;
      }
    },
    onPointMouseLeave: function(e) {
      const i = e.target.index;
      if (this.mode == 2) {
        this.points[i].size = this.size;
      }
    },
    resizePoints: function(cw, ch, ow, oh) {
      for (const i in this.points || []) {
        const p = this.points[i];
        this.points[i].x = (p.x * cw) / ow;
        this.points[i].y = (p.y * ch) / oh;
      }
    },
    // ライン操作
    addLine: function(i1, i2) {
      const p1 = this.points[i1];
      const p2 = this.points[i2];
      this.points[i1].color = this.color;
      this.points[i2].color = this.color;
      const count = this.lines.length;
      this.lines.push({
        id: count + 1,
        points: [p1.x, p1.y, p2.x, p2.y],
        ref: [i1, i2],
        size: 5,
        color: this.color,
        frame: { time: this.time, idx: this.idx },
        label: `lines-${count + 1}`
      });
    },
    resizeLines: function(cw, ch, ow, oh) {
      for (const i in this.lines || []) {
        const l = this.lines[i];
        const points = [
          (l.points[0] * cw) / ow,
          (l.points[1] * ch) / oh,
          (l.points[2] * cw) / ow,
          (l.points[3] * ch) / oh
        ];
        this.lines[i].points = points;
      }
    },
    onLineClick: function(e) {
      if (this.mode == 2) {
        const i = e.target.index;
        this.points.splice(this.lines[i].ref[0], 2);
        this.lines.splice(i, 1);
      }
    },
    onLineMouseEnter: function(e) {
      const i = e.target.index;
      if (this.mode == 2) {
        this.lines[i].size = this.size + 2;
        this.points[this.lines[i].ref[0]] = this.size + 2;
        this.points[this.lines[i].ref[1]] = this.size + 2;
      }
    },
    onLineMouseLeave: function(e) {
      const i = e.target.index;
      if (this.mode == 2) {
        this.lines[i].size = this.size;
        this.points[this.lines[i].ref[0]] = this.size;
        this.points[this.lines[i].ref[1]] = this.size;
      }
    },
    // 画像操作
    loadImage: function(val) {
      const img = new Image();
      img.src = val;
      img.onload = () => {
        this.onResize();
        this.background.image = img;
      };
    },
    onDblClick: function() {
      if (this.mode != 2) {
        this.mouse = this.$refs.stage.getNode().getPointerPosition();
        this.addPoint(this.mouse.x, this.mouse.y, this.color, this.size);
        if (this.mode == 0) {
          const ps = this.points.length;
          if (ps % 2 == 0) {
            this.addLine(ps - 2, ps - 1);
          }
        }
      }
    },
    onUpdatePoint: function(point) {
      const i = this.points.findIndex(x => x.id == point.id);
      this.points[i].label = point.label;
      this.points[i].color = point.color;
    },
    onUpdateLine: function(line) {
      const i = this.lines.findIndex(x => x.id == line.id);
      this.lines[i].label = line.label;
      this.lines[i].color = line.color;
      this.points[line.ref[0]].color = line.color;
      this.points[line.ref[1]].color = line.color;
    },
    onResize: function() {
      const cw = this.$refs.card.$el.clientWidth || 500;
      const ch = (this.originSize.height * cw) / this.originSize.width;
      const $cw = cw + 100 * this.scale;
      const $ch = ch + 100 * this.scale;

      this.resizePoints($cw, $ch, this.canvas.width, this.canvas.height);
      this.resizeLines($cw, $ch, this.canvas.width, this.canvas.height);

      this.canvas.width = $cw;
      this.canvas.height = $ch;
      this.background.height = $cw;
      this.background.width = $ch;

      this.widthRate = $cw / this.originSize.width;
      this.heightRate = $ch / this.originSize.height;
      this.canvasMaxHeight = ch - (64 + 64);

      this.$emit("update-max-width", String($cw + 16));
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
        for (const i in this.points) {
          const depth = this.idx - this.points[i].frame.idx;
          if (depth == 0) {
            this.points[i].color = this.color;
          }
          if (depth < 6) {
            this.points[i].color = this.oldColors[depth - 1];
          } else {
            this.points[i].color = "#9E9E9E";
          }
        }
        for (const i in this.lines) {
          const depth = this.idx - this.points[i].frame.idx;
          if (depth < 6) {
            this.lines[i].color = this.oldColors[depth - 1];
          } else {
            this.lines[i].color = "#9E9E9E";
          }
        }
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
