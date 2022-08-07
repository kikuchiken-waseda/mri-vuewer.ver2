<template>
  <v-form ref="form" v-model="valid">
    <v-file-input
      :label="`${$vuetify.lang.t('$vuetify.io.db.json.title')}*`"
      v-if="json === null"
      accept="application/json"
      @change="onChange"
    />
    <v-alert class="mt-4" v-else-if="!loading" prominent type="error">
      <v-row align="center">
        <v-col class="grow">
          {{ $vuetify.lang.t("$vuetify.forms.db.warning") }}
        </v-col>
        <v-col class="shrink pa-1">
          <v-btn @click="dbLoad" color="error darken-2">YES</v-btn>
          <v-btn
            @click="$emit('reject')"
            class="mt-4"
            color="error darken-3"
          >
            NO
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <div v-else class="text-center ma-5">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
      <span class="ma-5">Updateing db...</span>
    </div>
  </v-form>
</template>
<script>
export default {
  name: "m-db-import-form",
  data: () => ({
    valid: false,
    loading: false,
    json: null
  }),
  methods: {
    dbLoad: function() {
      this.loading = true;
      this.$store
        .dispatch("files/load", this.json)
        .then(() => {
          this.loading = false;
          this.$emit("loaded");
        })
        .catch(error => this.$emit("error", error));
    },
    onChange: function(e) {
      if (e) {
        if (e.name) {
          this.$emit("loading");
          let fr = new FileReader();
          fr.readAsText(e);
          fr.onload = () => {
            this.json = fr.result;
          };
        }
      }
    }
  }
};
</script>

<style scoped></style>
