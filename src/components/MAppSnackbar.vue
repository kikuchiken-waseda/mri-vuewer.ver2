<template>
  <v-snackbar
    :color="color"
    v-model="show"
    :timeout="timeout"
    top
    right
    absolute
    shaped
  >
    <v-icon v-if="type == 'error'" class="mr-1">mdi-alert-octagram</v-icon>
    <v-icon v-if="type == 'warning'" class="mr-1">mdi-alert</v-icon>
    <v-icon v-if="type == 'info'" class="mr-1">mdi-information</v-icon>
    <v-icon v-if="type == 'success'" class="mr-1">mdi-check-circle</v-icon>
    <span class="subtitle"> {{ message }} </span>
    <template v-slot:action="{ attrs }">
      <v-btn icon color="white" v-bind="attrs" @click="show = false">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  name: "m-app-snackbar",
  computed: {
    show: {
      get() {
        return this.$store.state.snackbar.show;
      },
      set(val) {
        this.$store.commit("snackbar/show", val);
      }
    },
    type: function() {
      return this.$store.state.snackbar.type;
    },
    color: function() {
      return this.$store.state.snackbar.color;
    },
    message: function() {
      return this.$store.state.snackbar.message || "THIS IS DEBUG MASSAGE";
    },
    timeout: function() {
      return this.$store.state.snackbar.timeout;
    }
  }
};
</script>

<style scoped></style>
