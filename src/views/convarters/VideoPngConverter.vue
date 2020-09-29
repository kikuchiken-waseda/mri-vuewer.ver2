<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-text>
        <v-switch v-model="crop.show" :label="`croping pngs`" />
        <v-row v-if="crop.show">
          <v-col cols="12" md="3">
            <v-text-field type="number" v-model="crop.x" label="x" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="number" v-model="crop.y" label="y" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="number" v-model="crop.w" label="width" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field type="number" v-model="crop.h" label="height" />
          </v-col>
        </v-row>
        <v-text-field type="number" v-model="frame" label="frame" />
        <m-video-input @loading="onLoading" @loaded="onLoaded" />
      </v-card-text>
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MVideoInput from "@/components/form/MVideoInput";
export default {
  name: "video-png-converter",
  components: { MViewLayout, MVideoInput },
  data: () => ({
    frame: -1,
    crop: {
      show: false,
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  }),
  computed: {
    heading: () => "Converter: mp4 to pngs",
    desc: () =>
      "mp4 ファイルを受け取り各フレーム毎の PNG ファイルを取得するデモです."
  },
  methods: {
    onLoading: function() {
      this.$vuewer.loading.start("$vuetify.converting");
    },
    onLoaded: async function(payload) {
      if (payload.source) {
        const buff = this.$vuewer.io.file.toBuff(payload.source);
        this.crop = Object.assign({}, this.crop, {
          x: Math.round(this.crop.x),
          y: Math.round(this.crop.y),
          w: Math.round(this.crop.w),
          h: Math.round(this.crop.h)
        });
        const crop = this.crop.show ? this.crop : null;
        if (this.frame == -1) {
          const result = this.$vuewer.io.video.toPngs(
            buff,
            payload.fps,
            payload.duration,
            crop
          );
          if (result.MEMFS) {
            const files = [];
            for (const out of result.MEMFS) {
              const blob = new Blob([out.data], { type: out.type });
              const base64 = await this.$vuewer.io.file.toBase64(blob);
              files.push({ name: out.name, base64 });
            }
            const zip = await this.$vuewer.io.zip.toZip(files);
            const name = payload.name.split(".")[0] + ".zip";
            this.$vuewer.io.file.download(zip, name);
          }
        } else {
          const result = this.$vuewer.io.video.toPng(
            buff,
            Number(this.frame),
            payload.fps,
            payload.duration,
            crop
          );
          if (result.MEMFS) {
            console.log(result.MEMFS.length);
            const out = result.MEMFS[0];
            const blob = new Blob([out.data], { type: out.type });
            const name = payload.name.split(".")[0] + ".png";
            this.$vuewer.io.file.download(blob, name);
          }
        }
      }
      this.$vuewer.loading.end();
    }
  }
};
</script>

<style scoped></style>
