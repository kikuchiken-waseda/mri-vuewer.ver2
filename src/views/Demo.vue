<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-col cols="12">
      <m-t-card title="Sample Videos">
        <v-list flat>
          <v-subheader>Select one item for the live demo.</v-subheader>
          <v-list-item-group v-model="sample" color="primary">
            <v-list-item v-for="(item, i) in samples" :key="i">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </m-t-card>
    </v-col>
    <v-col cols="12" v-if="sample !== null">
      <m-t-card title="Live Demo">
        <v-card-text class="text-center" v-if="loading.isloading">
          <v-progress-circular
            :size="100"
            :width="10"
            color="primary"
            indeterminate
          />
          <div class="font-weight-light subtitle-1">
            {{ loading.status }}
          </div>
        </v-card-text>
        <v-container fluid v-else-if="$source">
          <m-vuewer
            ref="video"
            :src="$source"
            :fps="$fps"
            :frames="frames"
            :origin-size="$originSize"
          />
        </v-container>
      </m-t-card>
    </v-col>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MTCard from "@/components/base/card/MTCard";
import MVuewer from "@/components/MVuewer";
import MVideoTWBMixin from "@/mixins/MVideoTWBMixin";
import io from "@/io";
export default {
  name: "Demo",
  mixins: [MVideoTWBMixin],
  components: {
    MViewLayout,
    MTCard,
    MVuewer
  },
  data: () => ({
    heading: "Live Demo",
    sample: null,
    samples: ["sample1.mp4", "sample2.mp4", "sample3.mp4"],
    frames: [],
    loading: {
      isloading: false,
      status: null
    }
  }),
  watch: {
    sample: function(val, oldval) {
      if (val !== null) {
        if (val != oldval) {
          this.$initVideo();
          this.fetchVideo(this.samples[val]);
        }
      }
    }
  },
  methods: {
    fetchVideo: async function(filename) {
      this.loading.isloading = true;
      this.loading.status = "file downloading...";
      const url = this.toUrl(filename);
      const file = await io.file
        .fetch(url, filename, { type: "video/mp4" })
        .catch(() => {
          this.loading.isloading = false;
          return null;
        });
      if (file) {
        this.frames = [];
        this.loading.status = "load vide info...";
        if (file.arrayBuffer) {
          const buff = await file.arrayBuffer();
          io.video.info(buff, res => {
            this.$fps = res.videoStream.fps;
            this.$videoStream = res.videoStream;
            this.$audioStream = res.audioStream;
            this.$originSize = res.size;
            this.$duration = res.duration;
            this.loading.status = "load vide file...";
            io.file.toBase64(file).then(res => {
              if (res) {
                this.$source = res;
                this.$name = filename;
                let step = 0;
                let currentTime = 0;
                const total = Math.floor(this.$duration * this.$fps);
                const frameRate = 1 / this.$fps;
                while (step < total) {
                  step++;
                  currentTime = currentTime + frameRate;
                  this.frames.push({
                    idx: step,
                    time: currentTime
                  });
                }
              }
              this.loading.isloading = false;
            });
          });
        } else {
          this.loading.isloading = false;
        }
      }
    },
    toUrl: function(filename) {
      return `https://raw.githubusercontent.com/qh73xe/mri-vuewer.dev/master/misc/${filename}`;
    }
  },
  computed: {
    desc: function() {
      return `${this.$vuetify.lang.t("$vuetify.demo.disc")}`;
    }
  }
};
</script>
<style scoped></style>
