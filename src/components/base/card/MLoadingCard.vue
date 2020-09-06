<template>
  <v-card :color="color" dark>
    <v-card-text class="pt-3">
      <slot></slot>
      <v-progress-linear
        class="mb-0"
        v-if="value > -1"
        :value="value"
        :color="progressColor"
        striped
      />
      <v-progress-linear
        class="mb-0"
        v-else
        :color="progressColor"
        indeterminate
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "m-loading-card",
  props: {
    value: {
      type: Number,
      default: -1
    },
    color: {
      type: String,
      default: "primary"
    },
    progressColor: {
      type: String,
      default: "white"
    }
  }
};
</script>
<style scoped></style>
