<template>
  <m-loading-dialog v-model="dialog">
    {{ $vuetify.lang.t(text) }}
  </m-loading-dialog>
</template>
<script>
import MLoadingDialog from "@/components/base/dialog/MLoadingDialog";
export default {
  name: "m-app-loading-dialog",
  components: {
    MLoadingDialog
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.loading.show;
      },
      set(val) {
        this.$store.commit("loading/show", val);
      }
    },
    text: function() {
      return this.$store.state.loading.message;
    },
    color: function() {
      return "primary";
    },
    progressColor: function() {
      return "white";
    }
  }
};
</script>

<style scoped></style>
