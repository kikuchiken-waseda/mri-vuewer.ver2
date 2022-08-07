<template>
  <m-card-dialog
    titleColor="warning darken-1"
    :title="$vuetify.lang.t(title)"
    v-model="dialog"
    max-width="700"
  >
    <template v-slot:toolbar-actions>
      <v-btn icon @click="onClose" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card @click="playPause">
      <video
        ref="video"
        :style="videoStyle"
        :src="$src"
        @pause="onPause"
        @play="onPlay"
        controls
      />
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
export default {
  name: "m-video-dialog",
  components: { MCardDialog },
  data: () => ({
    isPlaying: false,
    title: "Video Dialog",
    videoStyle: {
      width: "100%",
      height: "auto"
    }
  }),
  props: {
    value: {
      type: Boolean,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    start: {
      type: Number,
      default: 0
    },
    end: {
      type: Number,
      default: 0
    }
  },
  computed: {
    $src: function() {
      if (this.end !== 0)
        return `${this.src}#t=${this.start},${this.end}`;
      return this.src;
    },
    dialog: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    playPause: function() {
      if (this.$refs.video) {
        if (this.isPlaying) {
          this.$refs.video.pause();
        } else {
          this.$refs.video.play();
        }
      }
    },
    onPlay: function() {
      this.isPlaying = true;
      if (this.end !== 0) {
        const d = this.end - this.start;
        const video = this.$refs.video;
        setTimeout(() => {
          video.pause();
        }, d * 1000);
      }
    },
    onPause: function() {
      this.isPlaying = false;
      this.$refs.video.currentTime = this.start;
    },
    onClose: function() {
      if (this.isPlaying) this.$refs.video.pause();
      this.$refs.video.currentTime = this.start;
      this.dialog = false;
    }
  }
};
</script>
<style scoped></style>
