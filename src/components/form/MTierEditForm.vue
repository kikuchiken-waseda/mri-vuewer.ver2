<template>
  <v-form ref="form" v-model="valid">
    <v-autocomplete
      v-model="oldName"
      :rules="nameRule"
      :items="tiers"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`"
    />
    <v-text-field
      v-model="name"
      :rules="newNameRUle"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.name')}`"
    />
    <v-autocomplete
      :items="typeChoice"
      v-model="type"
      item-text="name"
      item-value="val"
      :label="`${$vuetify.lang.t('$vuetify.textgrid.tier.option.type')}`"
    />
    <v-alert class="mt-4" v-if="valid" prominent type="warning">
      <v-row align="center">
        <v-col class="grow">
          {{ $vuetify.lang.t("$vuetify.forms.tierEdit.warning") }}
        </v-col>
        <v-col class="shrink pa-1">
          <v-btn @click="run" color="warning darken-2">YES</v-btn>
          <v-btn @click="$emit('reject')" class="mt-4" color="warning darken-3">
            NO
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
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
        v => this.checkNameNotExist(v)
      ];
      return rules;
    },
    newNameRUle: function() {
      const rules = [
        v => !!v || this.$vuetify.lang.t("$vuetify.validations.required"),
        v => this.checkName(v)
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
    checkNameNotExist: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) == -1) {
          return this.$vuetify.lang.t("$vuetify.validations.notExist");
        }
        return true;
      }
      return this.$vuetify.lang.t("$vuetify.validations.required");
    },
    checkName: function(v) {
      if (v) {
        if (this.tiers.indexOf(v) > -1) {
          return this.$vuetify.lang.t("$vuetify.validations.alreadyExists");
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
