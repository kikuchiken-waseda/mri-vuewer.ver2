<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-col>
      <m-t-card dense accordion title="SYSTEM SETTING">
        <v-card-text>
          <m-app-setting-from />
        </v-card-text>
      </m-t-card>
      <m-t-card dense accordion class="mt-5" title="METADATA SETTING">
        <v-card tile>
          <v-card-text>
            <label>
              {{ $vuetify.lang.t("$vuetify.setting.form.metadata.label") }}
            </label>
            <m-meta-field-form @validated="onAddField" ref="newForm" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click.prevent="$refs.newForm.validate()" color="primary">
              ADD
            </v-btn>
          </v-card-actions>
          <v-divider />
          <v-list sub-group class="pt-0">
            <v-list-group sub-group :value="false">
              <template v-slot:activator>
                <v-list-item-title>FIELDS</v-list-item-title>
              </template>
              <v-divider />
              <v-list-item v-for="item in fields" :key="item">
                <v-list-item-content>
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small @click.stop="destoryField(item)" icon>
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
      </m-t-card>
      <m-t-card dense accordion class="mt-5" title="WAVESURFER SETTING">
        <v-card-text>
          <m-setting-from />
        </v-card-text>
      </m-t-card>

      <v-btn class="my-5" block @click="setDefaultSetting" color="error">
        Reset setting
      </v-btn>
    </v-col>
  </m-view-layout>
</template>
<script>
import MTCard from "@/components/base/card/MTCard.vue";
import MViewLayout from "@/components/base/MViewLayout";
import MSettingFrom from "@/components/form/MSettingForm.vue";
import MAppSettingFrom from "@/components/form/MAppSettingForm.vue";
import MMetaFieldForm from "@/components/form/MMetaFieldForm";
export default {
  name: "Setting",
  components: {
    MViewLayout,
    MTCard,
    MSettingFrom,
    MMetaFieldForm,
    MAppSettingFrom
  },
  data: () => ({
    heading: "Setting",
    fields: [] // メタデータに登録されているフィールド名
  }),
  methods: {
    setDefaultSetting: function() {
      this.$store.dispatch("setting/setDefault");
    },
    onAddField: function(key) {
      this.fields.push(key);
    },
    destoryField: function(item) {
      this.$store.commit("metadata/destroy", item);
      const i = this.fields.findIndex(x => x == item);
      if (i > -1) {
        this.fields.splice(i, 1);
      }
    }
  },
  computed: {
    desc: function() {
      return `${this.$vuetify.lang.t("$vuetify.setting.disc")}`;
    }
  },
  mounted: function() {
    const fields = this.$store.state.metadata.fields;
    this.fields = Array.from(fields);
  }
};
</script>

<style scoped></style>
