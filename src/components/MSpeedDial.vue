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

    <v-btn @click="$emit('click-detail')" fab dark small>
      <v-icon>mdi-eye</v-icon>
    </v-btn>

    <v-btn @click="$emit('click-ruler')" fab dark small color="orange">
      <v-icon>mdi-ruler</v-icon>
    </v-btn>

    <v-btn @click="$emit('click-image-edit')" fab dark small color="orange">
      <v-icon>mdi-selection-drag</v-icon>
    </v-btn>

    <v-btn @click="$emit('click-tier-edit')" fab dark small color="green">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>

    <v-btn @click="$emit('click-tier-add')" fab dark small color="indigo">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-btn @click="$emit('click-tier-delete')" fab dark small color="red">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>
<script>
export default {
  name: "m-speed-dial",
  data: () => ({
    fab: false
  })
};
</script>
<style scoped></style>
