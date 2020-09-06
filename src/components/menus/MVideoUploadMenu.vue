<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn dark icon v-bind="attrs" v-on="on">
        <v-icon>mdi-upload</v-icon>
      </v-btn>
    </template>
    <m-video-upload-list @click="$emit('click', $event)" />
  </v-menu>
</template>
<script>
import MVideoUploadList from "@/components/list/MVideoUploadList";
export default {
  name: "m-video-upload-menu",
  components: {
    MVideoUploadList
  }
};
</script>

<style scoped></style>
