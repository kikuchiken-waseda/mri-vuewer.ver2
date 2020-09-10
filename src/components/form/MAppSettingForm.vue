<template>
  <v-form ref="form">
    <div class="mb-4">
      <label>{{ t(`${locale}.loading.label`) }}</label>
      <v-checkbox
        class="mt-0"
        hide-details
        v-model="shouldGetVideoInfo"
        :label="t(`${locale}.loading.shouldGetVideoInfo.label`)"
      />
      <v-icon small>mdi-information</v-icon>
      <span
        class="caption ml-1"
        v-text="t(`${locale}.loading.shouldGetVideoInfo.hint`)"
      />
    </div>
    <v-text-field
      v-model="maxVideoSize"
      suffix="MB"
      :rules="rules.positiveIntegerRules"
      :label="t(`${locale}.loading.maxVideoSize.label`)"
      :hint="t(`${locale}.loading.maxVideoSize.hint`)"
    />

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
import MSettingMixin from "@/mixins/MSettingMixin";
export default {
  name: "m-app-setting-form",
  mixins: [MSettingMixin, MValidationMixin],
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
