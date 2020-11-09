<template>
  <m-view-layout :heading="heading" :desc="desc">
    <m-window-card :x="0" :y="0" title="window-card" max-width="400px">
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>Top 10 Australian beaches</v-card-title>
      </v-img>
    </m-window-card>

    <m-window-card hide right title="right-card" max-width="300px">
      <v-card tile flat>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"
          height="200px"
        >
          <v-card-title>Pre-fab homes</v-card-title>
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-bookmark</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </m-window-card>

    <m-window-card hide bottom title="bottom-card" max-width="200px">
      <v-card tile flat>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
          class="white--text align-end"
          height="100px"
          gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"
        >
          <v-card-title>Pre-fab homes</v-card-title>
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-bookmark</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </m-window-card>

    <m-window-card
      hide
      right
      bottom
      title="bottom-right-card"
      max-width="450px"
    >
      <v-card tile flat>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
          class="white--text align-end"
          height="100px"
          gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"
        >
          <v-card-title>Pre-fab homes</v-card-title>
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-bookmark</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </m-window-card>

    <m-window-sheet>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark fab fixed bottom right v-bind="attrs" v-on="on">
          <v-icon dark>mdi-menu</v-icon>
        </v-btn>
      </template>
    </m-window-sheet>
  </m-view-layout>
</template>
<script>
import MViewLayout from "@/components/base/MViewLayout";
import MWindowCard from "@/components/base/card/MWindowCard";
import MWindowSheet from "@/components/base/MWindowSheet.vue";
export default {
  name: "window-card",
  components: {
    MViewLayout,
    MWindowCard,
    MWindowSheet
  },
  data: () => ({
    heading: "Example: WindowCard",
    desc: "親要素の中を自由に移動できるカードのデモです"
  })
};
</script>

<style scoped></style>
