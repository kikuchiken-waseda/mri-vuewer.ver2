<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      v-model="name"
      :rules="nameRule"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`"
    />
    <v-autocomplete
      :items="typeChoice"
      v-model="type"
      item-text="name"
      item-value="val"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.type')}`"
    />
    <v-checkbox
      v-model="checkbox"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.showRef')}`"
    />
    <v-autocomplete
      v-if="checkbox"
      v-model="refName"
      :rules="refRule"
      :items="tiers"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.ref')}`"
    />
  </v-form>
</template>
<script>
export default {
  name: "WTierFrom",
  data: () => ({
    checkbox: false,
    valid: false,
    name: "",
    type: "",
    refName: ""
  }),
  props: {
    tiers: {
      type: Array
    }
  },
  computed: {
    typeChoice: function() {
      return [
        {
          name: this.$vuetify.lang.t("$vuetify.textgrid.tier.interval"),
          val: "interval"
        },
        {
          name: this.$vuetify.lang.t("$vuetify.textgrid.tier.point"),
          val: "point"
        }
      ];
    },
    nameRule: function() {
      const rules = [
        v => !!v || this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkName(v)
      ];
      return rules;
    },
    refRule: function() {
      const rules = [
        v => !!v || this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkNameNotExist(v)
      ];
      return rules;
    },

    required: function() {
      if (this.$vuetify) {
        return [
          v => !!v || this.$vuetify.lang.t("$vuetify.validations.required")
        ];
      }
      return [];
    }
  },
  methods: {
    checkName: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) > -1) {
          return this.$vuetify.lang.t("$vuetify.validations.alreadyExists");
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
    checkNameNotExist: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) == -1) {
          return this.$vuetify.lang.t("$vuetify.validations.notExist");
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
    validate: function() {
      this.$refs.form.validate();
      if (this.valid) {
        const item = {
          name: this.name,
          type: this.type,
          ref: this.refName || null
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
