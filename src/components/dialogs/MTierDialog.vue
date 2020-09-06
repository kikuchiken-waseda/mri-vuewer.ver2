<template>
  <m-card-dialog :title="$vuetify.lang.t(title)" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card>
      <v-card-text>
        <m-tier-form
          ref="form"
          v-if="dialog"
          :tiers="tiers"
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
import MTierForm from "@/components/form/MTierForm";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "m-tier-dialog",
  components: { MCardDialog, MTierForm },
  mixins: [MWavesurferMixin],
  data: () => ({
    title: "$vuetify.forms.tier.title"
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
      this.addTier(payload.name, payload.type);
      this.close();
    }
  }
};
</script>
<style scoped></style>
