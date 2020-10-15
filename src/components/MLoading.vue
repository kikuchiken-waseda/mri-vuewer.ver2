<template>
  <div class="text-center">
    <v-progress-circular
      :size="100"
      :width="10"
      color="primary"
      indeterminate
    />
    <div class="font-weight-light subtitle-1">
      {{ $vuetify.lang.t(text) }}
    </div>
  </div>
</template>
<script>
export default {
  name: "m-loading",
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped></style>
