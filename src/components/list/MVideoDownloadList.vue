<template>
  <v-list dense>
    <v-subheader>{{ $vuetify.lang.t("$vuetify.annotation") }}</v-subheader>
    <v-list-item @click="$emit('click', 'XLSX')">
      <v-list-item-title>XLSX</v-list-item-title>
    </v-list-item>
    <v-subheader>{{ $vuetify.lang.t("$vuetify.textgrid.name") }}</v-subheader>
    <v-list-item
      v-for="(item, i) in textgrid"
      :key="`t-${i}`"
      @click="$emit('click', `TEXTGRID/${item}`)"
    >
      <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
    <v-subheader>{{ $vuetify.lang.t("$vuetify.frame.name") }}</v-subheader>
    <v-list-item
      v-for="(item, i) in frame"
      :key="`f-${i}`"
      @click="$emit('click', `FRAME/${item}`)"
    >
      <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: "m-video-download-list",
  data: () => ({
    textgrid: ["TEXTGRID", "JSON", "XLSX"],
    frame: ["JSON", "XLSX"]
  })
};
</script>
<style scoped></style>
