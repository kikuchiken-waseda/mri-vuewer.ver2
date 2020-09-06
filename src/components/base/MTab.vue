<template>
  <v-hover v-slot:default="{ hover }">
    <v-tabs
      v-model="tab"
      dark
      grow
      show-arrows
      center-active
      :class="`elevation-${hover ? 4 : 1}`"
      :background-color="color"
    >
      <v-tabs-slider :color="sliderColor"></v-tabs-slider>
      <v-tab v-for="(item, i) in tabs" :key="i">
        {{ item }}
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="(item, i) in tabs" :key="i">
          <slot :item="item" :i="i"> </slot>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-hover>
</template>
<script>
export default {
  name: "MTab",
  props: {
    color: {
      type: String,
      default: "primary"
    },
    sliderColor: {
      type: String,
      default: function() {
        const res = `${this.color.split(" ")[0]} lighten-4`;
        return res;
      }
    },
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    tab: null
  })
};
</script>

<style scoped></style>
