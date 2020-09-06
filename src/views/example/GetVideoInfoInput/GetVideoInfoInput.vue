<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <v-card-text>
        <m-video-input @loading="onLoading" @loaded="onLoaded" />
      </v-card-text>
      <video v-if="video.source" :src="video.source" controls />
      <o-list v-if="baseInfo" :obj="baseInfo" caption="基本情報" />
      <o-list
        v-if="video.originSize"
        :obj="video.originSize"
        caption="画像サイズ"
      />
      <o-list
        v-if="video.videoStream"
        :obj="video.videoStream"
        caption="動画コーディック"
      />
      <o-list
        v-if="video.audioStream"
        :obj="video.audioStream"
        caption="音声コーディック"
      />
    </v-card>
    <m-loading-dialog v-model="isLoading">
      {{ status }}
    </m-loading-dialog>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MLoadingDialog from "@/components/base/dialog/MLoadingDialog";
import MVideoInput from "@/components/form/MVideoInput";
import OList from "./OList";
export default {
  name: "get-video-info-input",
  components: { MViewLayout, MLoadingDialog, MVideoInput, OList },
  data: () => ({
    heading: "Example: Get Video Info",
    desc: "mp4 ファイルを受け取りファイル情報を取得するデモです",
    isLoading: false,
    video: {},
    status: ""
  }),
  computed: {
    baseInfo: function() {
      if (this.video.name) {
        return {
          name: this.video.name,
          fps: this.video.fps,
          duration: this.video.duration
        };
      }
      return null;
    }
  },
  methods: {
    onLoading: function() {
      this.isLoading = true;
      this.status = "ファイル情報を取得中...";
    },
    onLoaded: function(payload) {
      this.isLoading = false;
      if (payload) {
        this.video = payload;
      } else {
        this.video = {};
      }
    }
  }
};
</script>

<style scoped></style>
