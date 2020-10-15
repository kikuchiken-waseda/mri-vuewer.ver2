<template>
  <v-layer ref="layer">
    <v-line
      :config="{
        points: [cursor.x || 0, 0, cursor.x || 0, ch],
        stroke: cursor.color,
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [2, 5]
      }"
    />
    <v-line
      :config="{
        points: [0, cursor.y || 0, cw, cursor.y || 0],
        stroke: cursor.color,
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [2, 5]
      }"
    />
    <v-circle
      @dblclick="$emit('dblclick', $event)"
      v-if="mode == 'circ' || mode == 'ruler'"
      :config="{
        x: cursor.x || 0,
        y: cursor.y || 0,
        stroke: 'white',
        strokeWidth: 1,
        radius: 5,
        fill: cursor.color
      }"
    />
    <v-rect
      @dblclick="$emit('dblclick', $event)"
      v-if="mode == 'rect'"
      :config="{
        stroke: cursor.color,
        x: cursor.x - cw / 5 / 2 || 0,
        y: cursor.y - ch / 5 / 2 || 0,
        width: cw / 5,
        height: ch / 5
      }"
    />
  </v-layer>
</template>
<script>
export default {
  name: "m-frame-editor-cursor",
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    cursor: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    mode: function() {
      return this.$store.state.current.frame.mode;
    },
    cw: function() {
      return this.$store.state.current.frame.cw;
    },
    ch: function() {
      return this.$store.state.current.frame.ch;
    }
  }
};
</script>

<style scoped></style>
