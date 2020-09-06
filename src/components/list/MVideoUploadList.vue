<template>
  <v-list dense>
    <v-subheader>{{ $vuetify.lang.t("$vuetify.textgrid.name") }}</v-subheader>
    <input
      ref="input"
      :accept="clicked.accept"
      @change="onChange"
      type="file"
      style="display:none"
    />

    <v-list-item v-for="(item, i) in textgrid" :key="i" @click="onClick(item)">
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: "m-video-upload-list",
  data: () => ({
    clicked: {
      name: "",
      accept: ""
    },
    textgrid: [
      {
        name: "TEXTGRID",
        accept: ".TextGrid,.textgrid,.Textgrid"
      },
      {
        name: "JSON",
        accept: "application/json"
      }
    ]
  }),
  methods: {
    onClick(item) {
      this.clicked = item;
      this.$nextTick(() => {
        this.$refs.input.click();
      });
    },
    onChange() {
      this.$nextTick(() => {
        const item = {
          click: this.clicked.name,
          files: this.$refs.input.files
        };
        this.$emit("click", item);
      });
    }
  }
};
</script>
<style scoped></style>
