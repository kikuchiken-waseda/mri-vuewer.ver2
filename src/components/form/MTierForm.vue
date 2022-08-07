<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      v-model="name"
      :rules="nameRule"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`
      "
    />
    <v-autocomplete
      :items="typeChoice"
      :filter="autocomplete"
      v-model="type"
      item-text="name"
      item-value="val"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.type')}`
      "
    />
    <v-checkbox
      v-model="checkbox"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.showRef')}`
      "
    />
    <v-autocomplete
      v-if="checkbox"
      v-model="refName"
      :rules="refRule"
      :items="tiers"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.ref')}`
      "
    />
    <v-checkbox
      v-if="checkbox"
      v-model="withText"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.withText')}`
      "
    />
    <v-checkbox
      v-if="checkbox"
      v-model="asParent"
      :label="
        `${$vuetify.lang.t('$vuetify.textgrid.tier.option.asParent')}`
      "
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
    refName: "",
    withText: false,
    asParent: false
  }),
  props: {
    tiers: { type: Array },
    current: { type: String }
  },
  watch: {
    current: function(val, old) {
      if (val !== old) {
        if (val) {
          this.refName = val;
          const ref = this.$store.state.current.textgrid[
            this.current
          ];
          this.name = `${this.current}-copy`;
          this.type = ref.type;
          this.checkbox = true;
          this.refName = this.current;
        }
      }
    }
  },
  computed: {
    typeChoice: function() {
      const locale = this.$vuetify.lang.current;
      return [
        {
          name: this.$vuetify.lang.t(
            "$vuetify.textgrid.tier.interval"
          ),
          rubi: locale == "ja" ? "kyoukaitenkisou" : "interval tier",
          val: "interval"
        },
        {
          name: this.$vuetify.lang.t("$vuetify.textgrid.tier.point"),
          rubi: locale == "ja" ? "eventtenkisou" : "point tier",
          val: "point"
        }
      ];
    },
    nameRule: function() {
      const rules = [
        v =>
          !!v ||
          this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkName(v)
      ];
      return rules;
    },
    refRule: function() {
      const rules = [
        v =>
          !!v ||
          this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkNameNotExist(v)
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
    autocomplete(item, input) {
      const rubi = item.rubi.toLowerCase();
      const val = item.val.toLowerCase();
      const query = input.toLowerCase();
      return rubi.startsWith(query) || val.startsWith(query);
    },
    checkName: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) > -1) {
          return this.$vuetify.lang.t(
            "$vuetify.validations.alreadyExists"
          );
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
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
    validate: function() {
      this.$refs.form.validate();
      if (this.valid) {
        const item = {
          name: this.name,
          type: this.type
        };
        if (this.checkbox) {
          item.ref = this.refName || null;
          item.withText = this.withText;
          item.parent = this.asParent ? this.refName : null;
        }
        this.$emit("validated", item);
      }
    },
    reset: function() {
      this.resetValidation();
    },
    resetValidation: function() {
      this.$refs.form.resetValidation();
    }
  },
  mounted: function() {
    if (this.current) {
      const ref = this.$store.state.current.textgrid[this.current];
      this.name = `${this.current}-copy`;
      this.type = ref.type;
      this.checkbox = true;
      this.refName = this.current;
    }
  }
};
</script>
<style scoped></style>
