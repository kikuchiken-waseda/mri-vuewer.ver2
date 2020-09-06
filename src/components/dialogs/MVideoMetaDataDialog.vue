<template>
  <m-card-dialog
    :title="$vuetify.lang.t(title)"
    titleColor="green"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card color="grey lighten-2">
      <v-card-text>
        <m-video-meta-data-form
          ref="form"
          v-if="dialog"
          :current-item="currentItem"
          @validated="onValidated"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="validate">ok</v-btn>
      </v-card-actions>
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MVideoMetaDataForm from "@/components/form/MVideoMetaDataForm";
export default {
  name: "m-video-meta-data-dialog",
  components: { MCardDialog, MVideoMetaDataForm },
  data: () => ({
    title: "$vuetify.forms.video.steps.meta"
  }),
  props: {
    value: {
      type: Boolean
    },
    currentItem: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
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
  watch: {
    dialog: function(val) {
      if (val == false) {
        this.$refs.form.reset();
      }
    }
  },
  methods: {
    close: function() {
      this.dialog = false;
    },
    validate: function() {
      this.$refs.form.validate();
    },
    onValidated: function(payload) {
      this.$emit("validated", payload);
      this.close();
    }
  }
};
</script>

<style scoped></style>
