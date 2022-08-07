<template>
  <v-card
    :style="`max-height: ${height}`"
    flat
    tile
    ref="card"
    color="grey"
  >
    <slot name="toolbar"></slot>
    <v-card
      flat
      tile
      class="overflow-y-auto"
      :style="`max-height: ${eHeight}px`"
    >
      <v-card flat tile class="overflow-y-auto">
        <slot></slot>
      </v-card>
      <slot name="table"></slot>
    </v-card>
  </v-card>
</template>
<script>
export default {
  name: "m-frame-editor-layout",
  props: {
    height: {
      type: String,
      default: "100%"
    }
  },
  computed: {
    eHeight: () => 500
  },
  methods: {
    getWidth: function() {
      if (this.$refs.card.$el) {
        return this.$refs.card.$el.clientWidth;
      }
      return 500;
    }
  }
};
</script>

<style scoped></style>
