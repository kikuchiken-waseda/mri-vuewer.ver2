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
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MTCard from "@/components/base/card/MTCard";
import io from "@/io";
export default {
  name: "Demo",
  components: {
    MViewLayout,
    MTCard
  },
  data: () => ({
    sample: null
  }),
  computed: {
    heading: () => "Live Demo",
    samples: () => ["sample1.mp4", "sample2.mp4", "sample3.mp4"],
    desc: function() {
      return `${this.$vuetify.lang.t("$vuetify.demo.disc")}`;
    }
  },
  watch: {
    sample: function(val, oldval) {
      if (val !== null && val != oldval) {
        this.fetchVideo(this.samples[val]);
      }
    }
  },
  methods: {
    fetchVideo: async function(filename) {
      this.$vuewer.loading.start("downloading a demo file ...");
      const url = this.toUrl(filename);
      try {
        const file = await io.file.fetch(url, filename, { type: "video/mp4" });
        if (file) {
          if (file.arrayBuffer) {
            const video = io.video.initObj();
            const buff = await file.arrayBuffer();
            io.video.info(buff, res => {
              video.fps = res.videoStream.fps;
              video.duration = res.duration;
              video.originSize = res.originSize;
              video.videoStream = res.videoStream;
              video.audioStream = res.audioStream;
              video.metaData = { demo: true };
              io.file.toBase64(file).then(source => {
                video.source = source;
                video.name = `DEMO: ${filename}`;

                // フレーム情報の追加
                video.frames = [];
                let idx = 0;
                let time = 0;
                const total = Math.floor(video.duration * video.fps);
                const frameRate = 1 / video.fps;
                while (idx < total) {
                  idx++;
                  time = time + frameRate;
                  video.frames.push({ idx, time });
                }
                this.$store
                  .dispatch("files/push", video)
                  .then(x => {
                    this.$vuewer.snackbar.success(
                      "$vuetify.forms.video.messages.success"
                    );
                    this.$router.push({ path: `/files/${x}` });
                  })
                  .catch(error => {
                    console.error(error);
                  })
                  .finally(() => {
                    this.$vuewer.loading.end();
                  });
              });
            });
          } else {
            this.$vuewer.loading.end();
          }
        }
      } catch {
        this.$vuewer.loading.end();
        return null;
      }
    },
    toUrl: function(filename) {
      return `https://raw.githubusercontent.com/qh73xe/mri-vuewer.dev/master/misc/${filename}`;
    }
  }
};
</script>
<style scoped></style>
