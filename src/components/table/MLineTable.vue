<template>
  <v-data-table :headers="headers" :items="lines">
    <template v-slot:item.label="props">
      <v-edit-dialog
        :return-value.sync="props.item.label"
        @close="close(props.item)"
      >
        {{ props.item.label }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.label"
            :rules="[max25chars]"
            label="Edit"
            single-line
            counter
          />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.time="props">
      {{ Math.round(props.item.frame.time) }}
    </template>

    <template v-slot:item.x1="props">
      {{ Math.round((props.item.points[0] / cw) * ow) }}
    </template>

    <template v-slot:item.y1="props">
      {{ Math.round((props.item.points[1] / cw) * ow) }}
    </template>

    <template v-slot:item.x2="props">
      {{ Math.round((props.item.points[2] / cw) * ow) }}
    </template>

    <template v-slot:item.y2="props">
      {{ Math.round((props.item.points[3] / cw) * ow) }}
    </template>

    <template v-slot:item.distance="props">
      {{ Math.round(getDistance(props.item.points)) }}
    </template>

    <template v-slot:item.color="props">
      <m-color-menu
        icon
        v-model="props.item.color"
        @input="close(props.item)"
      />
    </template>
  </v-data-table>
</template>
<script>
import MColorMenu from "@/components/menus/MColorMenu";
export default {
  name: "m-line-table",
  components: { MColorMenu },
  props: {
    showFrame: {
      type: Boolean,
      default: false
    },
    lines: {
      type: Array,
      require: true
    },
    originSize: {
      type: Object,
      require: true
    },
    canvasSize: {
      type: Object,
      require: true
    }
  },
  computed: {
    ow: function() {
      return this.originSize.width ? this.originSize.width : 0;
    },
    oh: function() {
      return this.originSize.height ? this.originSize.height : 0;
    },
    cw: function() {
      return this.canvasSize.width ? this.canvasSize.width : 0;
    },
    ch: function() {
      return this.canvasSize.height ? this.canvasSize.width : 0;
    },
    headers: function() {
      if (this.showFrame) {
        return [
          { text: "label", value: "label" },
          { text: "frame", value: "frame.idx" },
          { text: "time", value: "time" },
          { text: "x1", value: "x1" },
          { text: "y1", value: "y1" },
          { text: "x2", value: "x2" },
          { text: "y2", value: "y2" },
          { text: "distance", value: "distance" },
          { text: "color", value: "color" }
        ];
      }
      return [
        { text: "label", value: "label" },
        { text: "x1", value: "x1" },
        { text: "y1", value: "y1" },
        { text: "x2", value: "x2" },
        { text: "y2", value: "y2" },
        { text: "distance", value: "distance" },
        { text: "color", value: "color" }
      ];
    }
  },
  data: () => ({
    max25chars: v => v.length <= 25 || "Input too long!",
    pagination: {}
  }),
  methods: {
    getDistance: function(points) {
      const p1 = {
        x: (points[0] / this.cw) * this.ow,
        y: (points[1] / this.ch) * this.oh
      };
      const p2 = {
        x: (points[2] / this.cw) * this.ow,
        y: (points[3] / this.ch) * this.oh
      };
      return this.$vuewer.math.distance(p1, p2);
    },
    close(item) {
      this.$emit("update-line", item);
    }
  }
};
</script>

<style scoped></style>
