<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-card>
      <m-video-input @loading="onLoading" @loaded="onLoaded" />
    </v-card>

    <m-loading-dialog v-model="isLoading">
      {{ status }}
    </m-loading-dialog>

    <v-card class="mx-auto mt-5" max-width="400">
      <m-video
        controls
        @click="onEvent($event, 'click')"
        @dblclick="onEvent($event, 'dblclick')"
        @loadeddata="onEvent($event, 'loadeddata')"
        @timeupdate="onEvent($event, 'timeupdate')"
        :src="video.source"
        :frames="frames"
        :originSize="video.originSize"
        v-if="isLoaded && video.source"
      />
    </v-card>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MVideo from "@/components/video/MVideo.vue";
import MVideoInput from "@/components/form/MVideoInput";
import MLoadingDialog from "@/components/base/dialog/MLoadingDialog";
export default {
  name: "video-card",
  components: {
    MVideoInput,
    MLoadingDialog,
    MVideo,
    MViewLayout
  },
  data: () => ({
    heading: "Example: VideoCard",
    desc: "キャンバス付きビデオ表示コンポーネントの例です",
    status: "",
    isLoading: false,
    isLoaded: false,
    video: {},
    frames: []
  }),
  methods: {
    onEvent: function(payload, key) {
      console.log(key, payload);
    },
    onLoading: function() {
      this.isLoading = true;
      this.isLoaded = false;
      this.video = {};
      this.status = "ファイル情報を取得中...";
    },
    onLoaded: function(payload) {
      if (payload) {
        this.video = payload;
        const total = Math.floor(
          this.video.duration * this.video.fps
        );
        const frameRate = 1 / this.video.fps;

        let step = 0;
        let currentTime = 0;
        this.frames = [];
        while (step < total) {
          currentTime = currentTime + frameRate;
          this.frames.push({
            i: step,
            time: currentTime,
            points: [
              {
                x: (step / total) * this.video.originSize.width,
                y: this.video.originSize.height / 2,
                size: 5,
                color: "red"
              },
              {
                x: (step / total) * this.video.originSize.width,
                y: this.video.originSize.height / 3,
                size: 5,
                color: "green"
              }
            ],
            rects: [
              {
                x: this.video.originSize.width / 2,
                y: this.video.originSize.height / 2,
                width: this.video.originSize.width / 10,
                height: this.video.originSize.height / 10,
                rotation: 360 * (step / total),
                fill: "blue"
              }
            ],
            texts: [
              {
                x: 10,
                y: 10,
                text: `Frame: ${step}/${total}`,
                size: 20,
                fontStyle: "bold",
                color: "yellow"
              }
            ]
          });
          step++;
        }
        this.loaded = true;
      } else {
        this.video = {};
      }
      this.isLoading = false;
      this.isLoaded = true;
    }
  }
};
</script>

<style scoped></style>
