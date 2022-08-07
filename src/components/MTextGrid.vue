<template>
  <v-container
    fluid
    class="pa-0 transparent"
    @mouseover="$emit('mouseover')"
  >
    <m-key-context @keyup="$emit('keyup', $event)">
      <v-tabs
        v-model="tab"
        dark
        grow
        show-arrows
        center-active
        :background-color="color"
      >
        <v-tab v-for="(item, i) in tabs" :key="i">
          {{ item.text }}
          <v-icon small v-if="item.icon" class="ml-2">{{
            item.icon
          }}</v-icon>
        </v-tab>
        <v-tabs-slider color="yellow" />
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <m-frame-table
            :video-height="videoHeight"
            :frames="frames"
            @click-image-edit="$emit('click-image-edit', $event)"
            @click-ruler="$emit('click-ruler', $event)"
          />
        </v-tab-item>
        <v-tab-item v-for="tier in tiers" :key="tier">
          <m-text-grid-table
            :video-height="videoHeight"
            :title="tier"
            :tier="textgrid[tier]"
            @click-image-edit="$emit('click-image-edit', $event)"
          />
        </v-tab-item>
      </v-tabs-items>
    </m-key-context>
  </v-container>
</template>
<script>
import MTextGridTable from "@/components/table/MTextGridTable.vue";
import MFrameTable from "@/components/table/MFrameTable";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
import MKeyContext from "@/components/contextmenus/MKeyContext";
export default {
  name: "WTextGrid",
  mixins: { MWavesurferMixin },
  components: {
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
    tab: {
      get() {
        return this.$store.state.current.tab;
      },
      set(payload) {
        this.$store.commit("current/tab", payload);
      }
    },
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
    tiers: function() {
      return this.textgrid ? Object.keys(this.textgrid) : [];
    },
    tabs: function() {
      const tabs = [{ text: "FRAMES" }];
      for (const text of this.tiers) {
        const isP = this.parents.findIndex(p => p == text) != -1;
        const isC = this.children.findIndex(p => p == text) != -1;
        const icon = isP ? "mdi-link-lock" : isC ? "mdi-link" : "";
        tabs.push({ text, icon });
      }
      return tabs;
    }
  }
};
</script>

<style scoped></style>
