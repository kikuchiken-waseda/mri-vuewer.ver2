<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark text v-bind="attrs" v-on="on">
        Filter
      </v-btn>
    </template>
    <m-video-download-list @click="$emit('click', $event)" />
  </v-menu>
</template>
<script>
import MVideoDownloadList from "@/components/list/MVideoDownloadList";
export default {
  name: "m-frame-filer-menu",
  components: {
    MVideoDownloadList
  }
};
</script>
<style scoped></style>
