<template>
  <v-form ref="form">
    <label>{{ t(`${locale}.app.label`) }}</label>
    <v-text-field
      class="mb-5"
      v-model="timeout"
      :label="t(`${locale}.app.timeout.label`)"
      :hint="t(`${locale}.app.timeout.hint`)"
      :rules="rules.positiveIntegerOrErrorRules"
      persistent-hint
      suffix="Milli Sec"
    />
  </v-form>
</template>
<script>
import MValidationMixin from "@/mixins/MValidationMixin";
export default {
  name: "m-app-setting-form",
  mixins: [MValidationMixin],
  data: () => ({
    locale: "$vuetify.setting.form"
  }),
  computed: {
    timeout: {
      get() {
        return this.$store.state.snackbar.timeout;
      },
      set(val) {
        const type = typeof val;
        if (type == "number") {
          this.$store.commit("snackbar/timeout", val);
        } else if (type == "string") {
          if (Number(val)) {
            this.$store.commit("snackbar/timeout", Number(val));
          }
        }
      }
    }
  },
  methods: {
    t: function(val) {
      return this.$vuetify.lang.t(val);
    }
  }
};
</script>

<style scoped></style>
