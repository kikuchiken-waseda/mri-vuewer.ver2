<template>
  <m-drag-context>
    <m-view-layout :heading="heading" :desc="$vuetify.lang.t(desc)">
      <v-col :class="colClass">
        <v-card class="mt-6">
          <v-tabs v-model="tab" fixed-tabs background-color="primary" dark>
            <v-tab>File</v-tab>
            <v-tab>
              {{ $vuetify.lang.t("$vuetify.textgrid.tier.interval") }}
            </v-tab>
            <v-tab>
              {{ this.$vuetify.lang.t("$vuetify.textgrid.tier.point") }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <m-file-table />
            </v-tab-item>
            <v-tab-item>
              <m-file-interval-table :items="intervals" />
            </v-tab-item>
            <v-tab-item>
              <m-file-point-table :items="points" />
            </v-tab-item>
          </v-tabs-items>
        </v-card>

        <v-btn dark fab fixed bottom right color="primary" @click="fileAdd">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <m-file-upload-dialog v-model="dialog" />
      </v-col>
    </m-view-layout>
  </m-drag-context>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MFileTable from "@/components/table/MFileTable";
import MFileIntervalTable from "@/components/table/MFileIntervalTable";
import MFilePointTable from "@/components/table/MFilePointTable";
import MFileUploadDialog from "@/components/dialogs/MFileUploadDialog";
import MDragContext from "@/components/contextmenus/MDragContext.vue";
export default {
  name: "MetaManager",
  components: {
    MDragContext,
    MViewLayout,
    MFileUploadDialog,
    MFileTable,
    MFileIntervalTable,
    MFilePointTable
  },
  data: () => ({
    heading: "Data Manager",
    desc: "$vuetify.meta.disc",
    dialog: false,
    tab: null
  }),
  methods: {
    fileAdd: function() {
      this.dialog = true;
    }
  },
  computed: {
    colClass: function() {
      return this.$vuetify.breakpoint.smAndUp ? "" : "ma-0 pa-0";
    },
    keyword: function() {
      return this.$store.state.search.keyword;
    },
    records: function() {
      return this.$store.getters["files/records"];
    },
    intervals: function() {
      return this.records ? this.records.filter(x => x.type == "interval") : [];
    },
    points: function() {
      return this.records ? this.records.filter(x => x.type == "point") : [];
    }
  },
  mounted: function() {
    this.$store.dispatch("search/show");
  },
  beforeDestroy: function() {
    this.$store.dispatch("search/init");
  }
};
</script>

<style scoped></style>
