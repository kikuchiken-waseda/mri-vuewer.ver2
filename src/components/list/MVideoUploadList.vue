<template>
  <v-list dense>
    <input
      ref="input"
      :accept="clicked.accept"
      @change="onChange"
      type="file"
      style="display:none"
    />
    <v-list-group v-model="showTextGrid" @click.stop.prevent>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.textgrid.name") }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list-item
        v-for="(item, i) in textgrid"
        :key="i"
        @click="onClick(item)"
      >
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
    <v-list-group v-model="showVer1" @click.stop.prevent>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.ver1") }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list-item v-for="(item, i) in ver1" :key="i" @click="onClick(item)">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
    <v-list-group v-model="showPoint" @click.stop.prevent>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.frame.name") }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list-item v-for="(item, i) in point" :key="i" @click="onClick(item)">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>
<script>
export default {
  name: "m-video-upload-list",
  data: () => ({
    showTextGrid: true,
    showVer1: false,
    showPoint: false,
    clicked: {
      text: "",
      val: "",
      accept: ""
    },
    ver1: [
      {
        text: "JSON (VER1)",
        val: "TEXTGRID/JSON/VER1",
        accept: "application/json"
      },
      {
        text: "JSON (VER1: LEFT)",
        val: "TEXTGRID/JSON/VER1/LEFT",
        accept: "application/json"
      },
      {
        text: "JSON (VER1: RIGHT)",
        val: "TEXTGRID/JSON/VER1/RIGHT",
        accept: "application/json"
      },
      {
        text: "JSON (VER1: UP-DOWN)",
        val: "TEXTGRID/JSON/VER1/UP-DOWN",
        accept: "application/json"
      }
    ],
    textgrid: [
      {
        text: "TEXTGRID",
        val: "TEXTGRID/TEXTGRID",
        accept: ".TextGrid"
      },
      {
        text: "JSON",
        val: "TEXTGRID/JSON",
        accept: "application/json"
      }
    ],
    point: [
      {
        text: "XY",
        val: "POINTS/XY",
        accept: ".xy,.XY"
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
      const item = {
        click: this.clicked.val,
        files: this.$refs.input.files
      };
      this.$emit("click", item);
    }
  }
};
</script>
