<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-text>
        <m-video-input @loading="onLoading" @loaded="onLoaded" />
      </v-card-text>
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MVideoInput from "@/components/form/MVideoInput";
export default {
  name: "video-wav-converter",
  components: { MViewLayout, MVideoInput },
  computed: {
    heading: () => "Converter: mp4 to wav",
    desc: () => "mp4 ファイルを受け取り wav ファイルに変換します"
  },
  methods: {
    onLoading: function() {
      this.$vuewer.loading.start("$vuetify.converting");
    },
    onLoaded: async function(payload) {
      if (payload.source) {
        const buff = this.$vuewer.io.file.toBuff(payload.source);
        const result = this.$vuewer.io.video.toWav(buff);
        if (result.MEMFS.length) {
          const out = result.MEMFS[0];
          const blob = new Blob([out.data], { type: out.type });
          const name = payload.name.split(".")[0] + ".wav";
          this.$vuewer.io.file.download(blob, name);
        }
        this.$vuewer.loading.end();
      }
    }
  }
};
</script>

<style scoped></style>
