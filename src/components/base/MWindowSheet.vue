<template>
  <v-bottom-sheet v-model="sheet">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-list>
      <v-subheader>Open in</v-subheader>
      <v-list-item @click="open(item)" v-for="(item, i) in cards" :key="i">
        <v-list-item-icon v-if="item.icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title.toUpperCase() }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>
<script>
export default {
  name: "m-window-sheet",
  data: () => ({
    cards: [],
    sheet: false
  }),
  methods: {
    open: function(item) {
      this.sheet = false;
      item.open();
    }
  },
  mounted: function() {
    this.cards = this.$store.state.wcards.closings;
  },
  beforeDestroy: function() {
    this.$store.dispatch("wcards/init");
  }
};
</script>

<style scoped></style>
