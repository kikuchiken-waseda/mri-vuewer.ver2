<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      :rules="keyRules"
      :counter="10"
      v-model="name"
      required
      @keydown.enter.prevent="validate"
      label="New field"
    />
  </v-form>
</template>
<script>
export default {
  name: "m-meta-field-form",
  data: () => ({
    valid: false,
    name: ""
  }),
  methods: {
    checkName(v) {
      const fields = Array.from(this.$store.state.metadata.fields);
      if (v) {
        if (fields.indexOf(v) > -1) {
          return this.$vuetify.lang.t("$vuetify.validations.alreadyExists");
        }
        return true;
      }
      return false;
    },
    validate: function() {
      if (this.$refs.form) {
        this.$refs.form.validate();
        if (this.valid) {
          this.$store.commit("metadata/add", this.name);
          this.$emit("validated", this.name);
        }
      }
    },
    reset: function() {
      this.$refs.form.reset();
    },
    resetValidation: function() {
      this.$refs.form.resetValidation();
    }
  },
  computed: {
    keyRules: function() {
      const locale = "$vuetify.validations";
      return [
        v => !!v || this.$vuetify.lang.t(`${locale}.required`),
        v =>
          !!v ||
          v.length <= 10 ||
          this.$vuetify.lang.t(`${locale}.shorter`, 10),
        v => this.checkName(v)
      ];
    }
  }
};
</script>

<style scoped></style>
