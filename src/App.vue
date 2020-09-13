<template>
  <v-app>
    <m-app-bar />
    <m-navigation-drawer />
    <v-main>
      <router-view />
      <m-logging-seet />
      <m-app-snackbar />
    </v-main>
  </v-app>
</template>

<script>
import MAppBar from "./components/MAppBar.vue";
import MNavigationDrawer from "./components/MNavigationDrawer.vue";
import MLoggingSeet from "./components/MLoggingSeet.vue";
import MAppSnackbar from "./components/MAppSnackbar";

export default {
  name: "App",
  components: {
    MAppBar,
    MAppSnackbar,
    MNavigationDrawer,
    MLoggingSeet
  },
  data: () => ({}),
  mounted: function() {
    this.$store.commit("lang", this.$vuetify.lang);
    this.$store.dispatch("files/init");
  }
};
</script>
