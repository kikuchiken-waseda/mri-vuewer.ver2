<template>
  <v-bottom-sheet v-model="sheet">
    <v-card>
      <v-toolbar color="purple" dark flat>
        <v-text-field
          class="mx-4"
          v-model="search"
          flat
          rounded
          hide-details
          label="Search"
          prepend-inner-icon="mdi-magnify"
          solo-inverted
        />
        <template v-slot:extension>
          <v-tabs v-model="tabs" centered>
            <v-tab v-for="n in items.length" :key="n">
              {{ items[n - 1] }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card flat>
            <v-card-title class="headline">LOG</v-card-title>
            <v-data-table
              :headers="headers"
              :items="logs"
              :search="search"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-title class="headline">DB LOG</v-card-title>
            <v-data-table
              :headers="headers"
              :items="dblogs"
              :search="search"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-title class="headline">ERRORS</v-card-title>
            <v-data-table
              :headers="headers"
              :items="errors"
              :search="search"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-bottom-sheet>
</template>
<script>
export default {
  name: "m-logging-seet",
  data: () => ({
    search: "",
    tabs: null,
    items: ["SYSTEM", "DATABASE", "ERROR"]
  }),
  computed: {
    headers: function() {
      if (this.tabs == 1) {
        return [
          { text: "TIME", value: "time" },
          { text: "CRUD", value: "tag" },
          { text: "TABLE", value: "table" },
          { text: "DETAIL", value: "msg" }
        ];
      }
      return [
        { text: "TIME", value: "time" },
        { text: "TAG", value: "tag" },
        { text: "DETAIL", value: "msg" }
      ];
    },
    sheet: {
      get() {
        return this.$store.state.logging.show;
      },
      set(val) {
        this.$store.commit("logging/show", val);
      }
    },
    dblogs: function() {
      return this.$store.state.logging.dbLogs;
    },
    logs: function() {
      return this.$store.state.logging.logs;
    },
    errors: function() {
      return this.$store.state.logging.errors;
    }
  }
};
</script>
<style scoped></style>
