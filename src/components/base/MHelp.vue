<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
    </template>
    <div v-html="text" />
  </v-tooltip>
</template>
<script>
export default {
  name: "m-help",
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped></style>
