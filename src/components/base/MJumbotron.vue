<template>
  <section class="text-center">
    <h1
      class="font-weight-light display-3 text-truncate"
      v-text="`${heading}`"
    />
    <div
      v-show="$vuetify.breakpoint.smAndUp"
      v-if="desc"
      class="font-weight-light subtitle-1"
      v-html="desc"
    />
  </section>
</template>
<script>
export default {
  name: "WJumbotron.vue",
  props: {
    heading: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    }
  }
};
</script>
<style scoped></style>
