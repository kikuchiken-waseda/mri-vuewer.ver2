<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon color="indigo">mdi-file-music</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{
          audioStream.codec_name
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-action></v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          {{ audioStream.sample_rate }} Hz,
          {{ audioStream.channel_layout }},
          {{ audioStream.sample_fmt }}, {{ audioStream.bitrate }} kb/s
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: "m-audio-stream-list",
  props: {
    audioStream: {
      type: Object
    }
  }
};
</script>

<style scoped></style>
