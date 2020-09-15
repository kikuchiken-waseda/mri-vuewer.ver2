<template>
  <m-card-dialog persistent :title="t(title)" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <template v-slot:toolbar-actions>
      <v-btn icon @click="close" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card-text>
      <m-db-import-form
        @reject="onRejected"
        @loaded="onLoaded"
        @error="onError"
        v-if="dialog"
      />
    </v-card-text>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MDbImportForm from "@/components/form/MDbImportForm";
export default {
  name: "m-db-import-dialog",
  components: { MCardDialog, MDbImportForm },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    title: "$vuetify.forms.db.title",
    loaded: false
  }),
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    t: function(val) {
      return this.$vuetify.lang.t(val);
    },
    close: function() {
      this.dialog = false;
      if (!this.loaded) {
        this.$vuewer.snackbar.warning("$vuetify.forms.db.messages.stop");
      }
      if (this.$route.name !== "Home") {
        this.$router.push({ name: "Home" });
      }
    },
    onRejected: function() {
      this.loaded = false;
      this.close();
    },
    onLoaded: function() {
      this.loaded = true;
      this.close();
      this.$vuewer.snackbar.success("$vuetify.forms.db.messages.success");
    },
    onError: function(error) {
      this.loaded = true;
      this.close();
      if (~error.message.indexOf("out of memory")) {
        this.$vuewer.snackbar.error("$vuetify.forms.db.messages.outofmemory");
      } else {
        this.$vuewer.snackbar.error(error);
      }
    }
  }
};
</script>

<style scoped></style>
