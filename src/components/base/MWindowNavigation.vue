<template>
  <v-bottom-navigation dark app>
    <v-btn v-if="cards.length < 1">
      <span>NO CLOSED CARD</span>
    </v-btn>
    <v-btn
      @click="item.open"
      v-for="(item, i) in cards"
      :key="i"
      value="item.title"
    >
      <span>{{ item.title }}</span>
      <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  name: "m-system-navigation",
  data: () => ({
    cards: []
  }),
  mounted: function() {
    this.cards = this.$store.state.wcards.closings;
  },
  beforeDestroy: function() {
    this.$store.dispatch("wcards/init");
  }
};
</script>

<style scoped></style>
