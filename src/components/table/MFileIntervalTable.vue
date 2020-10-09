<template>
  <v-data-table
    v-model="selected"
    :search="$keyword"
    :headers="headers"
    :items="$items"
    item-key="id"
    show-select
  >
    <template v-slot:item.start="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.start }}
      </span>
    </template>
    <template v-slot:item.end="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.end }}
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
      <v-card flat>
        <m-video-dialog v-model="dialog" :src="src" :start="start" :end="end" />
        <v-card-actions v-if="selected.length > 1">
          <v-spacer />
          <v-btn color="primary" @click="resynthesis">Download (ZIP)</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-data-table>
</template>
<script>
import MVideoDialog from "@/components/dialogs/MVideoDialog";
import io from "@/io";
import math from "@/utils/math";
export default {
  name: "m-file-interval-table",
  components: {
    MVideoDialog
  },
  data: () => ({
    selected: [],
    headers: [
      { text: "File Name", value: "fileName" },
      { text: "Tier Name", value: "tier" },
      { text: "Index", value: "index" },
      { text: "Start Time", value: "start" },
      { text: "End Time", value: "end" },
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
    },
    $items: function() {
      if (this.items) {
        return this.items;
      }
      return [];
    }
  },
  methods: {
    playItem: function(item) {
      this.src = item.src;
      this.start = Number(item.start);
      this.end = Number(item.end);
      this.dialog = true;
    },
    trimItem: function(item) {
      const src = item.src;
      const bname = item.fileName.split(".")[0];
      const start = item.start;
      const end = item.end;
      const info =
        String(math.round(start, 3)) + "-" + String(math.round(end, 3));
      const name = `${bname}-${info}.mp4`;
      const buff = io.file.toBuff(src);
      const result = io.video.trim(buff, start, end);
      const out = result.MEMFS[0];
      const blob = io.video.toBlob(Buffer(out.data));
      io.file.download(blob, name);
    },
    openItem: function(item) {
      this.$router.push({ path: `/files/${item.fileId}?start=${item.start}` });
    },
    resynthesis: async function() {
      const files = [];
      for (const item of this.selected) {
        const buff = io.file.toBuff(item.src);
        const result = io.video.trim(buff, item.start, item.end);
        const out = result.MEMFS[0];
        const blob = new Blob([out.data], { type: "video/mp4" });
        const base64 = await io.file.toBase64(blob);
        const name = `${item.fileName}-${item.start}-${item.end}.mp4`;
        files.push({ name, base64 });
      }
      const zip = await io.zip.toZip(files);
      io.file.download(zip, "result.zip");
    }
  }
};
</script>
<style scoped></style>
