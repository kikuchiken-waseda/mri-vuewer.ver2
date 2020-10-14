<template>
  <v-data-table
    :headers="headers"
    :items="frames"
    :items-per-page="-1"
    sort-by="id"
    hide-default-footer
    :style="`max-height: ${videoHeight - 64 || 0}px`"
    class="overflow-y-auto"
  >
    <template v-slot:item.time="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.time }}
      </span>
    </template>

    <template v-slot:item.points="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
        v-if="item.points"
      >
        {{ item.points.length }}
      </span>
      <span v-else>0</span>
    </template>
    <template v-slot:item.rects="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
        v-if="item.rects"
      >
        {{ item.rects.length }}
      </span>
      <span v-else>0</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn class="mr-1" fab dark x-small @click="seek(item.time)">
        <v-icon>
          mdi-format-horizontal-align-right
        </v-icon>
      </v-btn>

      <v-btn
        class="mr-1"
        fab
        dark
        x-small
        color="orange"
        @click="$emit('click-image-edit', item.time)"
      >
        <v-icon>mdi-selection-drag</v-icon>
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
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "m-frame-table",
  mixins: [MWavesurferMixin],
  props: {
    videoHeight: {
      default: null
    },
    frames: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data: () => ({
    rulerDialog: false,
    headers: [
      { text: "id", value: "idx" },
      { text: "time", value: "time" },
      { text: "points", value: "points" },
      { text: "rects", value: "rects" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "end"
      }
    ]
  }),
  methods: {
    onClickRuler: function(item) {
      this.$emit("click-ruler", item.time);
    }
  }
};
</script>

<style scoped></style>
