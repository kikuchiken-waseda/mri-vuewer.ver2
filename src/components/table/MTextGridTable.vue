<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    :search="keyword"
    hide-default-footer
    sort-by="time"
    class="elevation-1"
  >
    <template v-slot:item.time="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.time }}
      </span>
    </template>
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
      <m-loading-dialog ref="loading">
        <p>{{ $vuetify.lang.t("$vuetify.loading") }}</p>
      </m-loading-dialog>
      <v-btn
        v-if="tier && tier.type == 'point'"
        class="mr-1"
        fab
        dark
        x-small
        @click="seek(item.time)"
      >
        <v-icon>
          mdi-format-horizontal-align-right
        </v-icon>
      </v-btn>
      <v-btn
        v-if="tier && tier.type == 'interval'"
        class="mr-1"
        fab
        dark
        x-small
        @click="play(item.start, item.end)"
      >
        <v-icon>
          mdi-play
        </v-icon>
      </v-btn>

      <v-btn
        v-if="tier && tier.type == 'interval'"
        class="mr-1"
        fab
        dark
        x-small
        @click="trimVideo(item.start, item.end)"
      >
        <v-icon>
          mdi-scissors-cutting
        </v-icon>
      </v-btn>

      <v-btn color="error" fab dark x-small @click="deleteItem(item)">
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-alert type="warning">
        No Data
      </v-alert>
    </template>
  </v-data-table>
</template>
<script>
import MLoadingDialog from "@/components/base/dialog/MLoadingDialog.vue";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import io from "@/io";
import math from "@/utils/math";
export default {
  name: "WTextGridTable",
  components: {
    MLoadingDialog
  },
  mixins: [MWavesurferMixin],
  props: {
    title: {
      type: String
    },
    tier: {
      type: Object
    }
  },
  data: () => ({
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),
  computed: {
    headers: function() {
      const headers = [];
      if (this.tier) {
        if (this.tier.type == "interval") {
          headers.push({ text: "Start Time (sec)", value: "start" });
          headers.push({ text: "End Time (sec)", value: "end" });
        } else {
          headers.push({ text: "Time (sec)", value: "time" });
        }
      }
      headers.push({ text: "Text", value: "text" });
      headers.push({
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "end"
      });
      return headers;
    },
    items: function() {
      if (this.tier) {
        if (this.tier.type == "interval") {
          this.tier.values.map((x, i) => {
            x.idx = i;
            if (i == 0) {
              x.start = 0;
            } else {
              x.start = this.tier.values[i - 1].time;
            }
            x.end = x.time;
            return x;
          });
          return this.tier.values;
        } else {
          return this.tier.values.map((x, i) => {
            const item = {
              idx: i,
              time: x.time,
              text: x.text
            };
            return item;
          });
        }
      }
      return [];
    },
    keyword: function() {
      return this.$store.state.search.keyword;
    }
  },
  methods: {
    deleteItem(item) {
      const vm = this;
      setTimeout(() => {
        if (vm.items.length == 1) {
          vm.deleteTier(vm.title);
        } else {
          vm.deleteTierValue(vm.title, item.idx);
        }
      }, 100);
    },
    trimVideo(start, end) {
      const src = this.$store.state.current.video.source;
      const bname = this.$store.state.current.video.filename.split(".")[0];
      const info =
        String(math.round(start, 3)) + "-" + String(math.round(end, 3));
      const name = `${bname}-${info}.mp4`;
      if (src) {
        const buff = io.file.toBuff(src);
        const result = io.video.trim(buff, start, end);
        const out = result.MEMFS[0];
        const blob = io.video.toBlob(Buffer(out.data));
        io.file.download(blob, name);
      }
    },
    close() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }
  }
};
</script>

<style scoped></style>
