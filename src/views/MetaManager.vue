<template>
  <m-view-layout :heading="heading" :desc="$vuetify.lang.t(desc)">
    <v-col>
      <v-text-field
        solo
        rounded
        label="Search"
        v-model="keyword"
        prepend-inner-icon="mdi-magnify"
      />

      <v-card class="mt-6">
        <m-file-table />
      </v-card>
      <v-btn dark fab fixed bottom right color="primary" @click="fileAdd">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <m-file-upload-dialog v-model="dialog" />
    </v-col>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MFileTable from "@/components/table/MFileTable";
import MFileUploadDialog from "@/components/dialogs/MFileUploadDialog";
export default {
  name: "MetaManager",
  components: {
    MViewLayout,
    MFileUploadDialog,
    MFileTable
  },
  data: () => ({
    heading: "Meta Data Manager",
    desc: "$vuetify.meta.disc",
    dialog: false
  }),
  methods: {
    fileAdd: function() {
      this.dialog = true;
    }
  },
  computed: {
    keyword: {
      get() {
        return this.$store.state.search.keyword;
      },
      set(val) {
        this.$store.commit("search/keyword", val);
      }
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
