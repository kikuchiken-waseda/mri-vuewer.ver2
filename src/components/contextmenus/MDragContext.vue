<template>
  <div class="fill-height" @dragenter="onDragEnter" @dragleave="onDragLeave">
    <div
      ref="overlay"
      v-if="overlay"
      class="fill-height drop-area"
      @dragenter="onDragEnter"
      @dragover.prevent
      @dragleave="onDragLeave"
      @drop.prevent="onDroped"
    >
      <span class="headline">
        <v-icon dark>mdi-file-upload</v-icon>
        Drop files here to uplod
      </span>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script>
export default {
  name: "m-drag-context",
  data: () => ({
    overlay: false
  }),
  methods: {
    onDragEnter() {
      this.overlay = true;
    },
    onDragLeave(e) {
      if (e.fromElement == null) this.overlay = false;
    },
    onDroped: async function(e) {
      if (e.dataTransfer) {
        const files = [...e.dataTransfer.files];
        const mp4s = files.filter(x => {
          return x.type == "video/mp4";
        });

        mp4s.forEach(async (f, i) => {
          if (i == 0) {
            this.$vuewer.loading.start("downloading mp4 files ...");
          }
          const video = this.$vuewer.io.video.initObj();
          const buff = await f.arrayBuffer();
          this.$vuewer.io.video.info(buff, async res => {
            video.fps = res.videoStream.fps;
            video.duration = res.duration;
            video.originSize = res.size;
            video.videoStream = res.videoStream;
            video.audioStream = res.audioStream;
            const source = await this.$vuewer.io.file.toBase64(f);
            video.source = source;
            video.name = f.name;
            // フレーム情報の追加
            video.frames = [];
            const total = Math.floor(video.duration * video.fps);
            const frameRate = 1 / video.fps;
            let time = 0;
            let idx = 0;
            while (idx < total) {
              idx++;
              time = time + frameRate;
              video.frames.push({ idx, time });
            }
            // メタデータの追加
            const metadata = this.$store.getters["setting/fname2meta"](f.name);
            if (metadata) video.metaData = metadata;
            const vid = await this.$store.dispatch("files/push", video);
            if (i == mp4s.length - 1) {
              this.$vuewer.loading.end();
              this.overlay = false;
              if (this.$store.state.setting.shouldMovePageAferAddingFile) {
                this.$router.push({ path: `/files/${vid}` });
              }
            }
          });
        });
        this.overlay = false;
      }
    }
  }
};
</script>

<style scoped>
.drop-area {
  background-color: #607d8b;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
