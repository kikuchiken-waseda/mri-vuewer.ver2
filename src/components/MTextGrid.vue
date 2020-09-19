<template>
  <v-container fluid class="pa-0 transparent" @mouseover="$emit('mouseover')">
    <m-key-context @keyup="$emit('keyup', $event)">
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
    </m-key-context>
  </v-container>
</template>
<script>
import MTab from "@/components/base/MTab.vue";
import MTextGridTable from "@/components/table/MTextGridTable.vue";
import MFrameTable from "@/components/table/MFrameTable";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import MKeyContext from "@/components/contextmenus/MKeyContext";
export default {
  name: "WTextGrid",
  mixins: { MWavesurferMixin },
  components: {
    MTab,
    MKeyContext,
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
    parents: function() {
      let parents = [];
      if (this.textgrid) {
        for (const key in this.textgrid) {
          if (this.textgrid[key].parent)
            parents.push(this.textgrid[key].parent);
        }
      }
      return this.$vuewer.math.uniq(parents);
    },
    children: function() {
      let children = [];
      if (this.textgrid) {
        for (const key in this.textgrid) {
          if (this.textgrid[key].parent) children.push(key);
        }
      }
      return this.$vuewer.math.uniq(children);
    },
    tabs: function() {
      const tabs = [{ text: "FRAMES" }];
      if (this.textgrid) {
        for (const x of Object.keys(this.textgrid)) {
          if (this.parents.findIndex(p => p == x) != -1) {
            tabs.push({
              text: x,
              icon: "mdi-link-lock"
            });
          } else if (this.children.findIndex(p => p == x) != -1) {
            tabs.push({
              text: x,
              icon: "mdi-link"
            });
          } else {
            tabs.push({ text: x });
          }
        }
      }
      return tabs;
    }
  }
};
</script>

<style scoped></style>
