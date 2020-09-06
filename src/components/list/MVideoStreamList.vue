<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon color="indigo">mdi-file-video</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ videoStream.codec_name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon />
      <v-list-item-content>
        <v-list-item-title>
          {{ videoStream.pix_fmt }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon />
      <v-list-item-content>
        <v-list-item-title>
          {{ videoStream.bitrate }} kb/s, {{ videoStream.tbr }} tbr,
          {{ videoStream.tbn }} tbn, {{ videoStream.tbc }} tbc
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: "m-video-stream-list",
  props: {
    videoStream: {
      type: Object,
      required: true
    }
  }
};
</script>
<style scoped></style>
