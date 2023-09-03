<template>
  <m-drag-context>
    <m-view-layout ref="layout" :heading="heading" :desc="desc">
      <v-row>
        <v-col
          cols="12"
          :md="cardCols"
          v-for="(nav, key) in navs"
          :key="key"
        >
          <m-h-card
            :class="mhClass"
            :color="nav.color"
            :icon="nav.icon"
            :title="nav.title"
            :small-value="nav.smallValue"
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
    fileRegistDialog: false,
    timer: null
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
        if (
          val == false &&
          this.$store.state.hash.info["file-update"]
        ) {
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
    storageSize: function() {
      const size = this.$store.state.storageSize;
      const header = this.$vuetify.lang.t(
        "$vuetify.home.upload.value"
      );

      if (size.quota && size.useage) {
        const quotaMb = size.quota / (1024 * 1024);
        const quota =
          quotaMb < 1024
            ? `${Math.floor(quotaMb)} Mb`
            : `${Math.floor(quotaMb / 1024)} Gb`;

        const useageMb = size.useage / (1023 * 1024);
        const useage =
          useageMb < 1024
            ? `${Math.floor(useageMb)} Mb`
            : `${Math.floor(useageMb / 1024)} Gb`;

        return `${header}: ${useage}/${quota}`;
      }
      return "";
    },
    navs: function() {
      const vm = this;
      return {
        upload: {
          icon: "mdi-file-upload",
          color: "primary",
          title: this.$vuetify.lang.t("$vuetify.home.upload.title"),
          subText: this.$vuetify.lang.t("$vuetify.home.upload.hint"),
          smallValue: this.storageSize,
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
          smallValue: "",
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
          smallValue: "",
          actions: [
            {
              icon: "mdi-dots-vertical",
              function: () => {
                vm.$router.push({ name: "Demo" });
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
  methods: {
    setStorageSize: function() {
      console.log("update Storage");
      this.$store.commit("storageSize");
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      if (this.$route.query.nextpage) {
        const path =
          "/" + this.$route.query.nextpage.replace("-", "/");
        this.$router.push({ path });
      }
      if (this.$store.state.hash.info["drawer"] || false) {
        this.$store.commit("drawer", true);
      }
      this.setStorageSize();
    });
  }
};
</script>
<style scoped></style>
