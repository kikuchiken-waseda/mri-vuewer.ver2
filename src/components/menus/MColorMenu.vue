<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="picker" dark v-bind="attrs" v-on="on">
        color
        <v-icon>mdi-palette</v-icon>
      </v-btn>
    </template>
    <v-color-picker v-model="picker" flat show-swatches />
  </v-menu>
</template>
<script>
export default {
  name: "m-color-menu",
  props: {
    value: {
      type: String
    }
  },
  computed: {
    picker: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style scoped></style>
