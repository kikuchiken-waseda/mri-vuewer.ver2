<template>
  <v-form ref="form" v-model="valid">
    <v-autocomplete
      v-model="oldName"
      :rules="nameRule"
      :items="tiers"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`
      "
    />

    <v-text-field
      v-model="name"
      :rules="newNameRUle"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`
      "
    />

    <v-autocomplete
      :items="typeChoice"
      v-model="type"
      item-text="name"
      item-value="val"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.type')}`
      "
    />
  </v-form>
</template>
<script>
export default {
  name: "WTierEditFrom",
  data: () => ({
    valid: false,
    oldName: "",
    name: "",
    type: ""
  }),
  watch: {
    oldName: function(val, old) {
      if (val !== old) {
        const ref = this.$store.state.current.textgrid[val];
        this.name = val;
        this.type = ref.type;
      }
    },
    current: function(val, old) {
      if (val !== old) {
        this.oldName = val;
      }
    }
  },
  props: {
    tiers: {
      type: Array
    },
    current: { type: String }
  },
  computed: {
    typeChoice: function() {
      return [
        {
          name: this.$vuetify.lang.t(
            "$vuetify.textgrid.tier.interval"
          ),
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
        v =>
          !!v ||
          this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkNameNotExist(v)
      ];
      return rules;
    },
    newNameRUle: function() {
      const rules = [
        v =>
          !!v ||
          this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkName(v)
      ];
      return rules;
    },
    required: function() {
      if (this.$vuetify) {
        return [
          v =>
            !!v ||
            this.$vuetify.lang.t("$vuetify.validations.required")
        ];
      }
      return [];
    }
  },
  methods: {
    checkNameNotExist: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) == -1) {
          return this.$vuetify.lang.t(
            "$vuetify.validations.notExist"
          );
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
    checkName: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) > -1) {
          if (v !== this.oldName) {
            return this.$vuetify.lang.t(
              "$vuetify.validations.alreadyExists"
            );
          }
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
    run: function() {
      if (this.valid) {
        const payload = {
          key: this.oldName,
          item: {
            name: this.name,
            type: this.type
          }
        };
        this.$emit("validated", payload);
      }
    },
    validate: function() {
      this.$refs.form.validate();
      this.run();
    },
    reset: function() {
      this.resetValidation();
    },
    resetValidation: function() {
      this.$refs.form.resetValidation();
    }
  },
  mounted: function() {
    if (this.current) this.oldName = this.current;
  }
};
</script>
<style scoped></style>
