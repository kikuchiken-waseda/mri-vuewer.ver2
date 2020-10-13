<template>
  <v-card flat tile>
    <v-tabs v-model="tab" fixed-tabs background-color="primary" dark>
      <v-tab> Points </v-tab>
      <v-tab> Rects </v-tab>
      <v-tab> Setting </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <m-point-table />
      </v-tab-item>
      <v-tab-item>
        <m-rect-table />
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
