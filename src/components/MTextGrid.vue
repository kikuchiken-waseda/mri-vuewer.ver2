<template>
  <v-container fluid class="pa-0 transparent" @mouseover="$emit('mouseover')">
    <m-tab :color="color" v-slot="tab" :tabs="tabs">
      <m-frame-table
        v-if="tab.i == 0"
        :video-height="videoHeight"
        :frames="frames"
        @click-image-edit="$emit('click-image-edit', $event)"
        @click-ruler="$emit('click-ruler', $event)"
      />
      <m-text-grid-table
        v-if="tab.i > 0"
        :video-height="videoHeight"
        :title="tab.item"
        :tier="textgrid[tab.item]"
        @click-image-edit="$emit('click-image-edit', $event)"
      />
    </m-tab>
  </v-container>
</template>
<script>
import MTab from "@/components/base/MTab.vue";
import MTextGridTable from "@/components/table/MTextGridTable.vue";
import MFrameTable from "@/components/table/MFrameTable";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "WTextGrid",
  mixins: [MWavesurferMixin],
  components: {
    MTab,
    MTextGridTable,
    MFrameTable
  },
  props: {
    color: {
      type: String,
      default: "primary"
    },
    videoHeight: {
      default: null
    },
    textgrid: {
      type: Object,
      default: function() {
        return {};
      }
    },
    frames: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  computed: {
    tabs: function() {
      const tabs = ["FRAMES"];
      if (this.textgrid) {
        for (const x of Object.keys(this.textgrid)) {
          tabs.push(x);
        }
      }
      return tabs;
    }
  }
};
</script>

<style scoped></style>
