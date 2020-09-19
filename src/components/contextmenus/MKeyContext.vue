<template>
  <div
    @keyup.stop.prevent="$emit('keyup', $event)"
    @keydown.stop.prevent="$emit('keydown', $event)"
    tabindex="0"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "m-key-context"
};
</script>

<style scoped></style>
