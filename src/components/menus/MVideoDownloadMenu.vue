<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark icon v-bind="attrs" v-on="on">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </template>
    <m-video-download-list @click="$emit('click', $event)" />
  </v-menu>
</template>
<script>
import MVideoDownloadList from "@/components/list/MVideoDownloadList";
export default {
  name: "m-video-download-menu",
  components: {
    MVideoDownloadList
  }
};
</script>
<style scoped></style>
