<template>
  <m-card-dialog
    titleColor="error"
    :title="$vuetify.lang.t(title)"
    :fullscreen="$store.state.current.layout.mini"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card>
      <v-card-text>
        <m-tier-delete-form
          ref="form"
          v-if="dialog"
          @validated="onValidated"
          :tiers="tiers"
          :current="current"
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
import MTierDeleteForm from "@/components/form/MTierDeleteForm";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "m-tier-delete-dialog",
  components: { MCardDialog, MTierDeleteForm },
  mixins: [MWavesurferMixin],
  data: () => ({
    title: "$vuetify.forms.tierDelete.title"
  }),
  props: {
    value: { type: Boolean },
    current: { type: String },
    tiers: { type: Array }
  },
  watch: {
    dialog: function(val) {
      if (val == false) {
        this.$refs.form.reset();
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
  methods: {
    close: function() {
      this.dialog = false;
    },
    validate: function() {
      this.$refs.form.validate();
    },
    onValidated: function(payload) {
      const names = payload.names;
      for (const x of names) {
        this.deleteTier(x);
      }
      this.close();
    }
  }
};
</script>
<style scoped></style>
