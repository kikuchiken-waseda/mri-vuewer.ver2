<template>
  <div
    ref="context"
    @keyup.stop.prevent="$emit('keyup', $event)"
    @keydown.stop.prevent="$emit('keydown', $event)"
    tabindex="0"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "m-key-context",
  methods: {
    focus: function() {
      this.$refs.context.focus();
    },
    blur: function() {
      this.$refs.context.blur();
    }
  }
};
</script>

<style scoped>
div {
  outline: none;
}
</style>
