<template>
  <m-card-dialog
    titleColor="green"
    :fullscreen="$store.state.current.layout.mini"
    :title="$vuetify.lang.t(title)"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card>
      <v-card-text>
        <v-autocomplete
          v-model="selected"
          :items="files"
          :loading="isLoading"
          item-text="name"
          label="target files"
          return-object
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="loadData">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
export default {
  name: "m-dropbox-dialog",
  components: { MCardDialog },
  data: () => ({
    tag: "component:m-dropbox-dialog",
    title: "$vuetify.pages.dropbox.load",
    isLoading: false,
    selected: null
  }),
  props: {
    value: { type: Boolean }
  },
  computed: {
    files: function() {
      return this.$store.state.files.chaches || [];
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    dialog: function(val) {
      if (val == false) this.selected = [];
    }
  },
  methods: {
    close: function() {
      this.dialog = false;
    },
    loadData: async function() {
      if (this.selected) {
        this.$vuewer.loading.start("sync db");
        const text = await this.$vuewer.dropbox.read(
          this.selected.path_display
        );
        const obj = JSON.parse(text);
        await this.$vuewer.db.put(obj);
        const files = await this.$vuewer.db.gets();
        this.$store.commit("files/files", files);
        this.$vuewer.loading.end();
        this.dialog = false;
      }
    }
  }
};
</script>
<style scoped></style>
