<template>
  <v-list>
    <v-subheader>{{ caption }}</v-subheader>
    <v-list-item v-for="(item, key) in obj" :key="key">
      <v-list-item-content>
        <v-list-item-title> {{ key }}: {{ item }} </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: "o-list",
  props: {
    obj: {
      type: Object
    },
    caption: {
      type: String
    }
  }
};
</script>

<style scoped></style>
