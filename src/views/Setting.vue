<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-col>
      <m-t-card dense accordion title="SYSTEM SETTING">
        <v-card-text>
          <m-app-setting-from />
        </v-card-text>
      </m-t-card>
      <m-t-card dense accordion class="mt-5" title="VUEWER SETTING">
        <v-card-text>
          <m-setting-from />
        </v-card-text>
      </m-t-card>

      <v-btn
        class="my-5"
        block
        @click="setDefaultSetting"
        color="error"
      >
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
export default {
  name: "Setting",
  components: {
    MViewLayout,
    MTCard,
    MSettingFrom,
    MAppSettingFrom
  },
  data: () => ({
    heading: "Setting"
  }),
  methods: {
    setDefaultSetting: function() {
      this.$store.dispatch("setting/setDefault");
    }
  },
  computed: {
    desc: function() {
      return `${this.$vuetify.lang.t("$vuetify.setting.disc")}`;
    }
  }
};
</script>

<style scoped></style>
