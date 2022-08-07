<template>
  <v-app>
    <m-app-bar />
    <m-navigation-drawer />
    <v-main>
      <router-view />
      <m-logging-seet />
      <m-app-snackbar />
      <m-app-loading-dialog />
    </v-main>
  </v-app>
</template>

<script>
import MAppBar from "./components/MAppBar";
import MNavigationDrawer from "./components/MNavigationDrawer";
import MLoggingSeet from "./components/MLoggingSeet";
import MAppSnackbar from "./components/MAppSnackbar";
import MAppLoadingDialog from "./components/MAppLoadingDialog.vue";

export default {
  name: "App",
  components: {
    MAppBar,
    MAppSnackbar,
    MNavigationDrawer,
    MLoggingSeet,
    MAppLoadingDialog
  },
  data: () => ({}),
  watch: {
    "$route.hash": function(val, old) {
      if (val != old)
        this.$store.dispatch("hash/text", this.$route.hash);
    }
  },
  mounted: function() {
    this.$store.commit("lang", this.$vuetify.lang);
    this.$store.dispatch("hash/text", this.$route.hash);
    this.$store.dispatch("files/init");
  }
};
</script>
