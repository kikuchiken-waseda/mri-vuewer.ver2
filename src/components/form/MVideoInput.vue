<template>
  <v-file-input
    :label="`${$vuetify.lang.t('$vuetify.io.mVideoInput.title')}*`"
    accept="video/mp4,video/webm"
    :rules="videoRules"
    show-size
    @change="onChange"
  />
</template>
<script>
import io from "@/io";
import MValidationMixin from "@/mixins/MValidationMixin";

export default {
  name: "MVideoInput",
  mixins: [MValidationMixin],
  data: () => ({
    video: io.video.initObj()
  }),
  methods: {
    onChange: async function(e) {
      this.clearVideo();
      if (e) {
        if (e.size < this.maxVideoSize) {
          this.$emit("loading");
          this.video.name = e.name;
          this.video.source = await io.file.toBase64(e);
          if (e.arrayBuffer) {
            const buff = await e.arrayBuffer();
            try {
              io.video.info(buff, res => {
                this.video.fps = res.videoStream.fps;
                this.video.videoStream = res.videoStream;
                this.video.audioStream = res.audioStream;
                this.video.originSize = res.size;
                this.video.duration = res.duration;
                this.$emit("loaded", this.video);
              });
            } catch (e) {
              this.video.errors.fps = "$vuetify.io.video.error.fps";
              this.video.errors.duration = "$vuetify.io.video.error.duration";
              this.video.errors.originSize.width =
                "$vuetify.io.video.error.originSize.width";
              this.video.errors.originSize.height =
                "$vuetify.io.video.error.originSize.height";
              this.$emit("loaded", this.video);
            }
          }
        }
      }
    },
    clearVideo: function() {
      this.video = io.video.initObj();
    }
  },
  computed: {
    maxVideoSize: function() {
      return this.$store.state.setting.maxVideoSize * 1000000;
    }
  }
};
</script>
