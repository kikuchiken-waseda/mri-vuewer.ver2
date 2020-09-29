<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text class="py-0">
          <m-meta-field-form @validated="onAddField" ref="newForm" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click.prevent="$refs.newForm.validate()"
            small
            color="primary"
          >
            ADD
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="mt-4" v-if="fields.length > 0">
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              :rules="valueRules"
              :counter="50"
              v-for="field in fields"
              :key="field"
              v-model="item[field]"
              required
              :label="field"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import MMetaFieldForm from "@/components/form/MMetaFieldForm";
export default {
  name: "m-video-meta-data-form",
  components: {
    MMetaFieldForm
  },
  props: {
    vname: {
      type: String,
      default: ""
    },
    currentItem: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: () => ({
    valid: false,
    fields: [],
    item: {}
  }),
  computed: {
    valueRules: function() {
      const locale = "$vuetify.validations";
      return [
        v =>
          v.length == 0 ||
          (v && v.length <= 50) ||
          this.$vuetify.lang.t(`${locale}.shorter`, 50)
      ];
    }
  },
  methods: {
    onAddField: function(key) {
      this.fields.push(key);
      this.item[key] = this.currentItem[key] || "";
    },
    destroy: function(e, key) {
      const idx = this.keys.findIndex(x => x == key);
      this.keys.splice(idx, 1);
    },
    validate() {
      if (this.$refs.form) {
        this.$refs.form.validate();
        if (this.valid) {
          this.$emit("validated", this.item);
        }
      } else {
        this.$emit("validated", this.item);
      }
    },
    reset() {
      for (const key in this.item) {
        this.item[key] = this.currentItem[key] || "";
      }
    }
  },
  mounted: function() {
    this.fields = this.$store.getters["files/fields"];
    for (const key of this.fields) {
      this.item[key] = this.currentItem[key] || "";
    }
  }
};
</script>

<style scoped></style>
