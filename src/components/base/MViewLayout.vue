<template>
  <v-container class="fill-height" fluid>
    <v-row v-if="showJumbotron">
      <v-col>
        <m-jumbotron :heading="heading" :desc="desc" />
      </v-col>
    </v-row>
    <v-row :class="colClass">
      <v-col :class="colClass">
        <slot></slot>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import MJumbotron from "@/components/base/MJumbotron.vue";
export default {
  name: "MViewLayout",
  components: {
    MJumbotron
  },
  props: {
    heading: {
      type: String
    },
    desc: {
      type: String
    }
  },
  computed: {
    showJumbotron: function() {
      if (this.heading) {
        return this.desc;
      }
      return false;
    },
    colClass: function() {
      return this.$vuetify.breakpoint.smAndUp ? "" : "ma-0 pa-0";
    }
  }
};
</script>

<style scoped></style>
