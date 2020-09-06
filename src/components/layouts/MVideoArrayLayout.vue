<template>
  <v-container fluid class="py-0 transparent">
    <v-row>
      <v-col class="pa-0">
        <v-card tile flat class="mb-0" color="transparent">
          <slot name="prev"></slot>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card tile flat color="transparent">
          <slot></slot>
        </v-card>
      </v-col>
      <v-col class="pa-0">
        <v-card tile flat color="transparent">
          <slot name="next"></slot>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "m-video-array-layout"
};
</script>

<style scoped></style>
