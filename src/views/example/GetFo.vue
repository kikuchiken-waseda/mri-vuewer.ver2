<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-text>
        <m-video-input @loading="onLoading" @loaded="onLoaded" />
      </v-card-text>
      <v-card-text>
        <pre>{{ video }}</pre>
      </v-card-text>
    </v-card>
    <m-loading-dialog v-model="isLoading">{{ status }}</m-loading-dialog>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MVideoInput from "@/components/form/MVideoInput";
import MLoadingDialog from "@/components/base/dialog/MLoadingDialog";
export default {
  name: "get-fo",
  components: { MViewLayout, MVideoInput, MLoadingDialog },
  data: () => ({
    video: {},
    isLoading: false,
    status: ""
  }),
  computed: {
    heading: () => "Example: Get F0",
    desc: () => "mp4 ファイルを受け取り f0 情報を取得するデモです"
  },
  methods: {
    onLoading: function() {
      this.isLoading = true;
      this.status = "ファイル情報を取得中...";
    },
    onLoaded: function(payload) {
      if (payload.source) {
        const buff = this.$vuewer.io.file.toBuff(payload.source);
        const result = this.$vuewer.io.video.toWav(buff);
        if (result.MEMFS) {
          console.log(result.MEMFS[0]);
        }
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped></style>
