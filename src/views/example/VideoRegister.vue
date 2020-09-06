<template>
  <m-view-layout :heading="heading" :desc="desc">
    <m-video-regist-from @loaded="onLoaded" />
    <v-card>
      <v-data-table
        :headers="headers"
        :loading="videoLoaing"
        loading-text="Loading... Please wait"
        :items="videos"
      >
        <template v-slot:item.video="{ item }">
          <video height="100" :src="item.source"></video>
        </template>
        <template v-slot:item.size="{ item }">
          {{ item.originSize.width }} x {{ item.originSize.height }}
        </template>
        <template v-slot:item.frame_num="{ item }">
          {{ item.frames.length }}
        </template>
        <template v-slot:item.tiers="{ item }">
          {{ Object.keys(item.textgrid).length }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn color="error" dark fab @click="deleteItem(item)">
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar.show" bottom right>
      {{ snackbar.text }}
    </v-snackbar>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MVideoRegistFrom from "@/components/form/MVideoRegistFrom.vue";
import db from "@/storage/db";
export default {
  name: "video-register",
  components: { MViewLayout, MVideoRegistFrom },
  data: () => ({
    heading: "Example: Video Registration",
    desc: "mp4 ファイルを受け取り内部 DB に登録するデモです",
    videos: [],
    videoLoaing: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "video", value: "video" },
      { text: "Name", value: "name" },
      { text: "FPS", value: "fps" },
      { text: "Duration", value: "duration" },
      { text: "Origin Size", value: "size" },
      { text: "Frame Num", value: "frame_num" },
      { text: "Tier Num", value: "tiers" },
      { text: "Actions", value: "actions" }
    ],
    snackbar: {
      show: false,
      text: ""
    }
  }),
  methods: {
    onLoaded: function(payload) {
      if (payload) {
        this.loadItems();
        this.snackbar.show = true;
        this.snackbar.text = `Add video: ${payload.id}: ${payload.name}`;
      }
    },
    loadItems: function() {
      const vm = this;
      this.videos = [];
      this.videoLoaing = true;
      db.files.toArray().then(items => {
        for (const x of items) {
          vm.videos.push(x);
        }
        vm.videoLoaing = false;
      });
    },
    deleteItem: function(item) {
      db.files.delete(item.id);
      this.loadItems();
    }
  },
  mounted: function() {
    this.loadItems();
  }
};
</script>

<style scoped></style>
