<template>
  <v-data-table
    :search="$keyword"
    :headers="headers"
    :items="items"
    item-key="id"
  >
    <template v-slot:item.time="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.time }}
      </span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row>
        <v-col cols="4" class="px-0">
          <v-btn fab dark x-small @click="playItem(item)">
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4" class="px-0">
          <v-btn fab dark x-small @click="trimItem(item)">
            <v-icon>mdi-scissors-cutting</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4" class="px-0">
          <v-btn fab dark x-small @click="openItem(item)">
            <v-icon>mdi-import</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-slot:footer>
      <m-video-dialog v-model="dialog" :src="src" :start="start" :end="end" />
    </template>
  </v-data-table>
</template>
<script>
import MVideoDialog from "@/components/dialogs/MVideoDialog";
import MSettingMixin from "@/mixins/MSettingMixin";
import io from "@/io";
import math from "@/utils/math";

export default {
  name: "m-file-point-table",
  components: {
    MVideoDialog
  },
  mixins: [MSettingMixin],
  data: () => ({
    headers: [
      { text: "File Name", value: "fileName" },
      { text: "Tier Name", value: "tier" },
      { text: "Index", value: "index" },
      { text: "Time", value: "time" },
      { text: "Text", value: "text" },
      { text: "Actions", value: "actions" }
    ],
    dialog: false,
    src: "",
    start: 0,
    end: 0
  }),
  props: {
    items: {
      type: Array
    }
  },
  computed: {
    $keyword: function() {
      return this.$store.state.search.keyword;
    }
  },
  methods: {
    playItem: function(item) {
      this.src = item.src;
      const offset = this.playOffset * (1 / item.fps);
      const start = item.time - offset;
      const end = item.time + offset;
      this.start = start > 0 ? start : 0;
      this.end = end < item.duration ? end : item.duration;
      this.dialog = true;
    },
    trimItem: function(item) {
      const offset = this.playOffset * (1 / item.fps);
      const src = item.src;
      const bname = item.fileName.split(".")[0];
      const start = item.time - offset;
      const end = item.time + offset;
      const _start = start > 0 ? start : 0;
      const _end = end < item.duration ? end : item.duration;
      const info =
        String(math.round(_start, 3)) + "-" + String(math.round(_end, 3));
      const name = `${bname}-${info}.mp4`;
      const buff = io.file.toBuff(src);
      const result = io.video.trim(buff, _start, _end);
      const out = result.MEMFS[0];
      const blob = io.video.toBlob(Buffer(out.data));
      io.file.download(blob, name);
    },
    openItem: function(item) {
      this.$router.push({ path: `/files/${item.fileId}?start=${item.time}` });
    }
  }
};
</script>

<style scoped></style>
