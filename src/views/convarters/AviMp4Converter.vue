<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-text>
        <v-file-input
          :label="
            `${$vuetify.lang.t('$vuetify.io.mVideoInput.title')}*`
          "
          accept=".avi,.AVI,video/x-msvideo"
          @change="onChange"
        />
      </v-card-text>
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
export default {
  name: "avi-wav-converter",
  components: { MViewLayout },
  computed: {
    heading: () => "Converter: avi to mp4",
    desc: () => "avi ファイルを受け取り mp4 ファイルに変換します"
  },
  methods: {
    onChange: async function(e) {
      this.$vuewer.loading.start("$vuetify.converting");
      const name = e.name;
      this.source = await this.$vuewer.io.file.toBase64(e);
      if (e.arrayBuffer) {
        const buff = await e.arrayBuffer();
        const result = this.$vuewer.io.video.toMp4(buff);
        if (result.MEMFS.length) {
          const out = result.MEMFS[0];
          const blob = new Blob([out.data], { type: out.type });
          const oname = name.split(".")[0] + ".mp4";
          this.$vuewer.io.file.download(blob, oname);
          this.$vuewer.loading.end();
        }
      }
    }
  }
};
</script>

<style scoped></style>
