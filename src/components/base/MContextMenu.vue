<template>
  <v-menu v-model="menu" absolute offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-card
        v-bind="attrs"
        @click.right.prevent="on.click"
        @keydown="on.keydown"
      >
        <slot></slot>
      </v-card>
    </template>
    <slot name="menus"></slot>
  </v-menu>
</template>
<script>
export default {
  name: "MContextMenu",
  data: () => ({
    menu: false
  })
};
</script>

<style scoped></style>
