<template>
  <v-hover v-slot:default="{ hover }">
    <v-card-actions
      :class="`elevation-${hover ? 6 : 4} blue-grey darken-4`"
      @mouseover="$emit('mouseover')"
    >
      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="skip(-longSkip / fps)"
      >
        <v-icon dark>mdi-skip-backward</v-icon>
      </v-btn>

      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="skipBackward"
      >
        <v-icon dark>mdi-skip-previous</v-icon>
      </v-btn>

      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="decPxPerSec"
      >
        <v-icon dark>mdi-magnify-minus</v-icon>
      </v-btn>
      <m-video-upload-menu @click="onUploadClick" />
      <v-spacer />
      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="playPause"
      >
        <v-icon dark>mdi-play-pause</v-icon>
      </v-btn>
      <v-spacer />

      <m-video-download-menu
        @click="$emit('download-click', $event)"
      />
      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="incPxPerSec"
      >
        <v-icon dark>mdi-magnify-plus</v-icon>
      </v-btn>

      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="skipForward"
      >
        <v-icon dark>mdi-skip-next</v-icon>
      </v-btn>
      <v-btn
        dark
        icon
        :class="`elevation-${hover ? 4 : 0}`"
        @click="skip(longSkip / fps)"
      >
        <v-icon dark>mdi-skip-forward</v-icon>
      </v-btn>
    </v-card-actions>
  </v-hover>
</template>
<script>
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import MVideoDownloadMenu from "@/components/menus/MVideoDownloadMenu";
import MVideoUploadMenu from "@/components/menus/MVideoUploadMenu";
export default {
  name: "WVuewerActions",
  mixins: [MWavesurferMixin],
  components: {
    MVideoDownloadMenu,
    MVideoUploadMenu
  },
  props: {
    fps: {
      type: Number,
      required: true
    },
    longSkip: {
      type: Number,
      default: 5
    }
  },
  computed: {
    $minPxPerSec: {
      get() {
        return this.$store.state.setting.minPxPerSec;
      },
      set(val) {
        const type = typeof val;
        let minPxPerSec = null;
        if (type == "number") {
          minPxPerSec = val;
        } else if (type == "string") {
          minPxPerSec = Number(val);
        }
        if (minPxPerSec) {
          this.$store.commit("setting/setMinPxPerSec", minPxPerSec);
        }
      }
    }
  },
  methods: {
    onUploadClick(payload) {
      this.$emit("upload-click", payload);
    },
    incPxPerSec() {
      if (this.$minPxPerSec < 700) {
        this.$minPxPerSec = this.$minPxPerSec + 50;
      }
    },
    decPxPerSec: function() {
      if (this.$minPxPerSec > 100) {
        this.$minPxPerSec = this.$minPxPerSec - 50;
      }
    }
  }
};
</script>
