<template>
  <v-list dense>
    <v-list-item @click="$emit('click', 'XLSX')">
      <v-list-item-icon>
        <v-icon>mdi-google-spreadsheet</v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $vuetify.lang.t("$vuetify.downloads.xlsx") }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item @click="$emit('click', 'JSON')">
      <v-list-item-icon>
        <v-icon>mdi-code-json</v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $vuetify.lang.t("$vuetify.downloads.json") }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item @click="$emit('click', 'PNG')">
      <v-list-item-icon>
        <v-icon>mdi-file-image</v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $vuetify.lang.t("$vuetify.downloads.png") }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item @click="$emit('click', 'MP4')">
      <v-list-item-icon>
        <v-icon>mdi-file-video</v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $vuetify.lang.t("$vuetify.downloads.mp4") }}
      </v-list-item-title>
    </v-list-item>

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
        :key="`t-${i}`"
        @click="$emit('click', `TEXTGRID/${item.value}`)"
      >
        <v-list-item-title>
          {{ $vuetify.lang.t(item.text) }}
        </v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list-group v-model="showFrame" @click.stop.prevent>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            {{ $vuetify.lang.t("$vuetify.frame.name") }}
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list-item
        v-for="(item, i) in frame"
        :key="`t-${i}`"
        @click="$emit('click', `FRAME/${item.value}`)"
      >
        <v-list-item-title>
          {{ $vuetify.lang.t(item.text) }}
        </v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>
<script>
export default {
  name: "m-video-download-list",
  data: () => ({
    showTextGrid: false,
    showFrame: false,
    textgrid: [
      { text: "$vuetify.downloads.textgrid.textgrid", value: "TEXTGRID" },
      { text: "$vuetify.downloads.textgrid.json", value: "JSON" },
      { text: "$vuetify.downloads.textgrid.xlsx", value: "XLSX" }
    ],
    frame: [
      { text: "$vuetify.downloads.frame.json", value: "JSON" },
      { text: "$vuetify.downloads.frame.xlsx", value: "XLSX" }
    ]
  })
};
</script>
<style scoped></style>
