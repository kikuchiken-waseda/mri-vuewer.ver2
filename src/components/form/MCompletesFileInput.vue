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
          const _text = await this.readFile(f);
          if (_text) {
            const texts = _text
              .replace(/\r\n?/g, "\n")
              .split("\n")
              .filter(x => x !== "");
            const t = this.$vuewer.text;
            const isSafe = t.checker.isSafe(texts.join(""));
            if (isSafe) {
              const contents = texts.map(x => {
                const text = t.trim(x);
                return { name: text, val: text, rubi: text };
              });
              dict[key] = contents;
            } else {
              const srcs = texts.map(x => t.trim(x));
              const _yomi = await t.oyomi(srcs.join("&"));
              const yomi = t
                .clean(_yomi.join(" "))
                .replace(/\s/g, "")
                .split("&");
              const contents = srcs.map((x, i) => {
                const rubi = yomi[i]
                  ? t.toHebon(yomi[i])
                  : t.toHebon(x);
                return { name: x, val: x, rubi: rubi };
              });
              dict[key] = contents;
            }
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
