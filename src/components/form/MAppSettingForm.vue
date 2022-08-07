<template>
  <v-form ref="form">
    <label>{{ t(`${locale}.loading.label`) }}</label>
    <div class="mb-4">
      <v-checkbox
        class="mt-0"
        hide-details
        v-model="$shouldGetVideoInfo"
        :label="t(`${locale}.loading.shouldGetVideoInfo.label`)"
      />
      <span class="caption ml-1">
        <v-icon small>mdi-information</v-icon>
        {{ t(`${locale}.loading.shouldGetVideoInfo.hint`) }}
      </span>
    </div>
    <v-checkbox
      v-model="$shouldMovePageAferAddingFile"
      :label="
        t(`${locale}.loading.shouldMovePageAferAddingFile.label`)
      "
    />
    <v-text-field
      v-model="$nameFormat"
      :suffix="`sep = '${$nameSep}'`"
      :label="t(`${locale}.loading.nameFormat.label`)"
      :hint="t(`${locale}.loading.nameFormat.hint`)"
    />
    <v-text-field
      v-model="$maxVideoSize"
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
    <v-select
      class="mb-5"
      v-model="$filesOrderKey"
      :items="filesOrderKeyChoices"
      item-text="text"
      item-value="val"
      :label="t(`${locale}.app.filesOrderKey.label`)"
    />

    <v-checkbox
      class="mt-0"
      hide-details
      v-model="$showDev"
      :label="t(`${locale}.app.showDev.label`)"
    />
    <v-checkbox
      class="mt-0"
      hide-details
      v-model="$syncDropbox"
      :label="t(`${locale}.app.syncDropbox.label`)"
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
    filesOrderKeyChoices: function() {
      return [
        {
          text: this.t(
            `${this.locale}.app.filesOrderKey.choices.default`
          ),
          val: "default"
        },
        {
          text: this.t(
            `${this.locale}.app.filesOrderKey.choices.name`
          ),
          val: "name"
        },
        {
          text: this.t(
            `${this.locale}.app.filesOrderKey.choices.lastModifiedAt`
          ),
          val: "lastModifiedAt"
        }
      ];
    },
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
