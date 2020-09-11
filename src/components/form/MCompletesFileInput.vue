<template>
  <v-file-input
    :label="`${$vuetify.lang.t('$vuetify.io.completes.title')}*`"
    multiple
    chips
    accept=".dic,.text,.DIC,.TEXT"
    @change="onChange"
  >
    <template v-slot:selection="{ index, text }">
      <v-chip color="deep-purple accent-4" dark label small>
        {{ text }}
      </v-chip>
    </template>
  </v-file-input>
</template>
<script>
export default {
  name: "m-completes-file-input",
  methods: {
    onChange: async function(files) {
      const dict = {};
      for (const f of files) {
        const key = f.name.split(".")[0];
        try {
          const text = await this.readFile(f);
          if (text) {
            const contents = text
              .replace(/\r\n?/g, "\n")
              .split("\n")
              .filter(x => x !== "");
            dict[key] = contents;
          }
        } catch (e) {
          console.log(e);
        }
      }
      this.$store.commit("current/complates/complates", dict);
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
  }
};
</script>
<style scoped></style>
