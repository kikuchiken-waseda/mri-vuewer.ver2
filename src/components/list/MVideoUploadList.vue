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
      <v-list-item-title>{{ item.text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: "m-video-upload-list",
  data: () => ({
    clicked: {
      text: "",
      val: "",
      accept: ""
    },
    textgrid: [
      {
        text: "TEXTGRID",
        val: "TEXTGRID/TEXTGRID",
        accept: ".TextGrid,.textgrid,.Textgrid"
      },
      {
        text: "JSON",
        val: "TEXTGRID/JSON",
        accept: "application/json"
      },
      {
        text: "JSON (ver1)",
        val: "TEXTGRID/JSON-VER1",
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
          click: this.clicked.val,
          files: this.$refs.input.files
        };
        this.$emit("click", item);
      });
    }
  }
};
</script>
<style scoped></style>
