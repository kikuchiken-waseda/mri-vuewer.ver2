<template>
  <m-drag-context>
    <m-view-layout ref="layout" :heading="heading" :desc="desc">
      <v-row>
        <v-col cols="12" :md="cardCols" v-for="(nav, key) in navs" :key="key">
          <m-h-card
            :class="mhClass"
            :color="nav.color"
            :icon="nav.icon"
            :title="nav.title"
            sub-icon="mdi-information"
            :sub-text="nav.subText"
            :actions="nav.actions"
          />
        </v-col>
        <v-col cols="12"> </v-col>
      </v-row>
      <m-file-upload-dialog v-model="dialog" />
    </m-view-layout>
  </m-drag-context>
</template>

<script>
import MHCard from "@/components/base/card/MHCard.vue";
import MFileUploadDialog from "@/components/dialogs/MFileUploadDialog";
import MViewLayout from "@/components/base/MViewLayout";
import MDragContext from "@/components/contextmenus/MDragContext.vue";
export default {
  name: "Home",
  components: {
    MDragContext,
    MViewLayout,
    MHCard,
    MFileUploadDialog
  },
  data: () => ({
    fileRegistDialog: false
  }),
  computed: {
    mhClass: function() {
      return this.$vuetify.breakpoint.smAndUp ? "" : "mt-5";
    },
    dialog: {
      get() {
        if (this.$store.state.hash.info["file-update"] || false) {
          return true;
        }
        return this.fileRegistDialog;
      },
      set(val) {
        if (val == false && this.$store.state.hash.info["file-update"]) {
          this.$store.state.hash.info["file-update"] = false;
        }
        this.fileRegistDialog = val;
      }
    },
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
                vm.$router.push({ name: "Meta" });
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
                vm.$router.push({ name: "Meta" });
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
    this.$nextTick(() => {
      if (this.$store.state.hash.info["drawer"] || false) {
        this.$store.commit("drawer", true);
      }
    });
  }
};
</script>
<style scoped></style>
