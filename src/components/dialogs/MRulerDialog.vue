<template>
  <m-card-dialog
    persistent
    titleColor="warning darken-1"
    :title="$vuetify.lang.t(title)"
    :max-width="maxWidth"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>

    <template v-slot:toolbar-actions>
      <v-btn icon @click="close" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>

    <v-card v-if="!isFinished" :width="maxWidth">
      <v-stage ref="stage" :config="originSize">
        <v-layer ref="layer">
          <v-image
            @click="onClick"
            @mousemove="onMouseMove"
            :config="{ image: image }"
          />
        </v-layer>
        <v-layer ref="layer">
          <v-line v-if="showLine" :config="line" />
        </v-layer>
        <v-layer>
          <v-circle v-for="(x, i) in points" :key="i" :config="x" />
        </v-layer>
      </v-stage>

      <v-card-text class="caption">
        <p class="my-0">x: {{ mouseInfo.x }} px</p>
        <p class="my-0">y: {{ mouseInfo.y }} px</p>
        <p v-if="distance" class="my-0">d: {{ distance }} px</p>
      </v-card-text>
      <v-card-actions>
        <v-btn dark block color="primary" @click="next">
          next
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="distances.length > 0 && !isFinished">
        <v-btn dark block color="error" @click="finish">
          finish
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="showChart">
      <m-distance-chart :data="chartData" />
    </v-card>
  </m-card-dialog>
</template>

<script>
import MDistanceChart from "@/components/charts/MDistanceChart.vue";
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import util from "@/utils";
export default {
  name: "m-ruler-dialog",
  components: { MCardDialog, MDistanceChart },
  mixins: [MWavesurferMixin],
  data: () => ({
    title: "$vuetify.forms.ruler.title",
    color: "deep-orange",
    showLine: false,
    showChart: false,
    points: [],
    distance: null,
    line: {},
    mouse: {
      x: null,
      y: null
    },
    image: null,
    distances: [],
    marks: [],
    isFinished: false
  }),
  props: {
    value: {
      type: Boolean
    },
    originSize: {
      type: Object,
      required: true
    },
    src: {
      default: null
    }
  },
  watch: {
    src: function(val) {
      if (val) {
        const img = new Image();
        img.src = val;
        img.onload = () => {
          this.image = img;
        };
      }
    }
  },
  computed: {
    chartData: function() {
      const data = [["frame", "distance"]];
      for (const i in this.distances) {
        if (this.distances[i]) {
          data.push([`frame-${i}`, this.distances[i]]);
        }
      }
      return data;
    },
    maxWidth: function() {
      if (this.isFinished) return "500px";
      return `${this.originSize.width || 200}px`;
    },
    mouseInfo: function() {
      if (this.mouse.x && this.mouse.y) {
        return {
          x: util.math.round(this.mouse.x, 3),
          y: util.math.round(this.mouse.y, 3)
        };
      }
      return { x: null, y: null };
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    init: function() {
      this.showLine = false;
      this.points = [];
      this.distance = null;
      this.line = {};
      this.mouse = {
        x: null,
        y: null
      };
      this.image = null;
    },
    next: function() {
      this.distances.push(this.distance);
      for (const p of this.points) {
        this.marks.push({ x: p.x, y: p.y });
      }
      this.init();
      this.skipForward();
    },
    finish: function() {
      this.distances.push(this.distance);
      for (const p of this.points) {
        this.marks.push({ x: p.x, y: p.y });
      }
      this.init();
      this.isFinished = true;
      this.$emit("finished", { distances: this.distances, marks: this.marks });
      this.$nextTick(() => {
        this.showChart = true;
      });
    },
    close: function() {
      this.init();
      this.distances = [];
      this.marks = [];
      this.isFinished = false;
      this.showChart = false;
      this.dialog = false;
    },
    onClick: function() {
      this.mouse = this.$refs.stage.getNode().getPointerPosition();
      if (this.points.length == 0) {
        // 点を追加
        this.points.push({
          x: this.mouse.x,
          y: this.mouse.y,
          radius: 4,
          fill: util.color.toCss(this.color, this.$vuetify)
        });
        // 直線の始点を追加
        this.line = {
          points: [this.mouse.x, this.mouse.y],
          stroke: util.color.toCss(this.color, this.$vuetify),
          strokeWidth: 2
        };
      } else if (this.points.length == 1) {
        this.points.push({
          x: this.mouse.x,
          y: this.mouse.y,
          radius: 4,
          fill: util.color.toCss(this.color, this.$vuetify)
        });
        this.line.points.push(this.mouse.x);
        this.line.points.push(this.mouse.y);
        this.distance = util.math.distance(
          { x: this.line.points[0], y: this.line.points[1] },
          { x: this.line.points[2], y: this.line.points[3] }
        );
        this.showLine = true;
      }
    },
    onMouseMove: function() {
      this.mouse = this.$refs.stage.getNode().getPointerPosition();
    }
  }
};
</script>

<style scoped></style>
