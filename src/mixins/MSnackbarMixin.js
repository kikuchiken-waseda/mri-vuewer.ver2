export default {
  methods: {
    showError: function(error) {
      if (error instanceof Error) {
        console.error(error);
        this.$store.dispatch("snackbar/error", error.message);
      } else {
        this.$store.dispatch("snackbar/error", error);
      }
    },
    showWarning: function(message) {
      this.$store.dispatch("snackbar/warning", message);
    },
    showSuccess: function(message) {
      this.$store.dispatch("snackbar/success", message);
    },
    showInfo: function(message) {
      this.$store.dispatch("snackbar/info", message);
    },
    showBrowserError: function() {
      const message = this.$vuetify.lang.t("$vuetify.browserError");
      this.showWarning(message);
    }
  }
};
