<template>
  <v-form ref="form" v-model="valid">
    <v-autocomplete
      :rules="nameRule"
      v-model="names"
      :items="tiers"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`"
      multiple
    />
  </v-form>
</template>
<script>
export default {
  name: "WTierDeleteFrom",
  data: () => ({
    valid: false,
    names: []
  }),
  props: {
    tiers: {
      type: Array
    }
  },
  computed: {
    nameRule: function() {
      const rules = [
        v => !!v || this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkName(v)
      ];
      return rules;
    }
  },
  methods: {
    checkName: function(v) {
      if (v) {
        for (const x of v) {
          if (this.tiers.indexOf(x) == -1) {
            return this.$vuetify.lang.t("$vuetify.validations.notExist");
          }
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
    validate: function() {
      this.$refs.form.validate();
      if (this.valid) {
        const item = {
          names: this.names
        };
        this.$emit("validated", item);
      }
    },
    reset: function() {
      this.resetValidation();
    },
    resetValidation: function() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
<style scoped></style>
