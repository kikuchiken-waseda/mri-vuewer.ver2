<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="left"
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="blue darken-2" dark fab>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-apps</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-for="(item, key) in btns.filter(b => b.show)"
      :key="key"
      @click="$emit(item.event)"
      fab
      dark
      small
      :color="item.color"
    >
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-speed-dial>
</template>
<script>
export default {
  name: "m-speed-dial",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fab: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    btns: function() {
      return [
        {
          event: "click-detail",
          color: "black",
          icon: "mdi-eye",
          show: this.$vuetify.breakpoint.smAndUp
        },
        {
          event: "click-setting",
          color: "black",
          icon: "mdi-cog",
          show: this.$vuetify.breakpoint.smAndUp
        },
        {
          event: "click-save",
          color: "black",
          icon: "mdi-content-save",
          show: this.$vuetify.breakpoint.smAndUp
        },
        {
          event: "click-image-edit",
          color: "orange",
          icon: "mdi-selection-drag",
          show: this.$store.state.current.frame.src !== null
        },
        {
          event: "click-tier-edit",
          color: "green",
          icon: "mdi-pencil",
          show: true
        },
        {
          event: "click-tier-add",
          color: "indigo",
          icon: "mdi-plus",
          show: true
        },
        {
          event: "click-tier-delete",
          color: "red",
          icon: "mdi-delete",
          show: true
        }
      ];
    }
  }
};
</script>
<style scoped></style>
