<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-text>
        <v-file-input
          :label="`${$vuetify.lang.t('$vuetify.io.mVideoInput.title')}*`"
          accept="video/mp4"
          :rules="videoRules"
          show-size
          @change="onChange"
        />
      </v-card-text>
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MValidationMixin from "@/mixins/MValidationMixin.js";
import io from "@/io";
export default {
  name: "video-trim",
  mixins: [MValidationMixin],
  components: {
    MViewLayout
  },
  data: () => ({
    heading: "Example: TRIM VIDEO",
    desc: "動画切り出し関数の処理例です(特定の動画の5-10secを切り出します)"
  }),
  methods: {
    onChange: async function(e) {
      if (e) {
        if (e.arrayBuffer) {
          const buff = await e.arrayBuffer();
          const result = io.video.trim(buff, 5, 10);
          const out = result.MEMFS[0];
          const blob = io.video.toBlob(Buffer(out.data));
          io.file.download(blob, out.name);
        }
      }
    }
  }
};
</script>
<style scoped></style>
