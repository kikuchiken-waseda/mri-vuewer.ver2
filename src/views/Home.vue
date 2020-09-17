<template>
  <m-view-layout :heading="heading" :desc="desc">
    <v-row>
      <v-col cols="12" :md="cardCols" v-for="(nav, key) in navs" :key="key">
        <m-h-card
          :color="nav.color"
          :icon="nav.icon"
          :title="nav.title"
          sub-icon="mdi-information"
          :sub-text="nav.subText"
          :actions="nav.actions"
        />
      </v-col>
    </v-row>
    <m-file-upload-dialog v-model="fileRegistDialog" />
  </m-view-layout>
</template>

<script>
import MHCard from "@/components/base/card/MHCard.vue";
import MFileUploadDialog from "@/components/dialogs/MFileUploadDialog";
import MViewLayout from "@/components/base/MViewLayout";
export default {
  name: "Home",
  components: {
    MViewLayout,
    MHCard,
    MFileUploadDialog
  },
  data: () => ({
    fileRegistDialog: false
  }),
  methods: {
    to: function(payload) {
      this.$router.push(payload);
    }
  },
  computed: {
    name: function() {
      return this.$store.state.appName;
    },
    version: function() {
      return this.$store.state.appVersion;
    },
    heading: function() {
      return `${this.name} ver.${this.version}`;
    },
    desc: function() {
      return `${this.$vuewer.t("$vuetify.home.disc")}`;
    },
    navs: function() {
      const vm = this;
      return {
        upload: {
          icon: "mdi-file-upload",
          color: "primary",
          title: this.$vuetify.lang.t("$vuetify.home.upload.title"),
          subText: this.$vuetify.lang.t("$vuetify.home.upload.hint"),
          actions: [
            {
              icon: "mdi-plus",
              function: () => {
                this.fileRegistDialog = true;
              }
            }
          ]
        },
        manage: {
          color: "primary",
          icon: "mdi-database-search",
          title: this.$vuetify.lang.t("$vuetify.home.manage.title"),
          subText: this.$vuetify.lang.t("$vuetify.home.manage.hint"),
          actions: [
            {
              icon: "mdi-dots-vertical",
              function: () => {
                vm.to({ name: "Meta" });
              }
            }
          ]
        },
        demo: {
          color: "primary",
          icon: "mdi-code-brackets",
          title: this.$vuetify.lang.t("$vuetify.home.demo.title"),
          subText: this.$vuetify.lang.t("$vuetify.home.demo.hint"),
          actions: [
            {
              icon: "mdi-dots-vertical",
              function: () => {
                vm.to({ name: "Demo" });
              }
            }
          ]
        }
      };
    },
    cardCols: function() {
      const navSize = Object.keys(this.navs).length;
      return Math.round(12 / navSize);
    }
  },
  mounted: function() {
    const nextpage = this.$route.query.nextpage;
    if (nextpage) {
      const path = nextpage.replace("-", "/");
      this.$router.push({ path: path });
    }
  }
};
</script>
