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
        <m-tier-edit-form
          ref="form"
          v-if="dialog"
          :tiers="tiers"
          @validated="onValidated"
          @reject="onReject"
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
import MTierEditForm from "@/components/form/MTierEditForm";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "m-tier-edit-dialog",
  components: { MCardDialog, MTierEditForm },
  mixins: [MWavesurferMixin],
  data: () => ({
    title: "$vuetify.forms.tierEdit.title"
  }),
  props: {
    value: {
      type: Boolean
    },
    tiers: {
      type: Array
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
      if (payload.key) this.deleteTier(payload.key);
      if (payload.item) {
        if ((payload.item.name, payload.item.type)) {
          this.addTier(payload.item.name, payload.item.type);
        }
      }
      this.dialog = false;
    },
    onReject: function() {
      this.dialog = false;
    }
  }
};
</script>
<style scoped></style>
