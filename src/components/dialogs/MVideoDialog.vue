<template>
  <m-card-dialog
    titleColor="warning darken-1"
    :title="$vuetify.lang.t(title)"
    v-model="dialog"
    max-width="700"
  >
    <template v-slot:toolbar-actions>
      <v-btn icon @click="dialog = false" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card @click="play" :style="videoStyle">
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
      required: true
    },
    end: {
      type: Number,
      required: true
    }
  },
  computed: {
    $src: function() {
      return `${this.src}#t=${this.start},${this.end}`;
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
    play: function() {
      if (this.$refs.video) {
        this.$refs.video.play();
      }
    },
    onPlay: function() {
      const d = this.end - this.start;
      const video = this.$refs.video;
      setTimeout(() => {
        video.pause();
      }, d * 1000);
    },
    onPause: function() {
      this.$refs.video.currentTime = this.start;
    }
  }
};
</script>
<style scoped></style>
