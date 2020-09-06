<template>
  <v-form ref="form">
    <v-text-field v-model="time" label="Time" />
    <v-text-field v-model="text" label="Text" />
  </v-form>
</template>
<script>
export default {
  name: "WTierValueFrom",
  data: () => ({
    time: null,
    text: null
  })
};
</script>
<style scoped></style>
