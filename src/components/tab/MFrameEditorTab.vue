<template>
  <v-card flat tile>
    <v-tabs v-model="tab" fixed-tabs background-color="primary" dark>
      <v-tab> Points </v-tab>
      <v-tab> Rects </v-tab>
      <v-tab> Setting </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <m-point-table
          :points="points"
          :origin-size="originSize"
          :canvas-size="canvasSize"
          @update-point="$emit('update-point')"
        />
      </v-tab-item>
      <v-tab-item>
        <m-rect-table
          :rects="rects"
          :origin-size="originSize"
          :canvas-size="canvasSize"
          @update-rect="$emit('update-rect')"
        />
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-card-text>
            <m-frame-edit-conf-form />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import MPointTable from "@/components/table/MPointTable";
import MRectTable from "@/components/table/MRectTable";
import MFrameEditConfForm from "@/components/form/MFrameEditConfForm";
export default {
  name: "m-frame-editor-tab",
  components: {
    MFrameEditConfForm,
    MPointTable,
    MRectTable
  },
  props: {
    originSize: {
      type: Object,
      required: true
    },
    canvasSize: {
      type: Object,
      required: true
    },
    rects: {
      type: Array,
      required: true
    },
    points: {
      type: Array,
      required: true
    }
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.current.frame.tab;
      },
      set(tab) {
        this.$store.commit("current/frame/tab", tab);
      }
    }
  }
};
</script>
<style scoped></style>
