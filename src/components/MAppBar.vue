<template>
  <v-app-bar app color="primary" dark style="z-index:99">
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp">
      {{ title }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-text-field
      flat
      rounded
      solo-inverted
      hide-details
      label="Search"
      v-model="keyword"
      v-if="isSearch"
      background-color="primary lighten-1"
      prepend-inner-icon="mdi-magnify"
    />
    <v-spacer />
    <v-toolbar-title class="mr-3" v-if="!$store.state.current.layout.mini">
      {{ fileInfo }}
    </v-toolbar-title>
    <v-btn icon @click="to({ name: 'Home' })">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn icon :href="$store.state.github">
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark icon v-bind="attrs" v-on="on">
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$vuetify.lang.current = 'en'">
          <v-list-item-title>English</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$vuetify.lang.current = 'ja'">
          <v-list-item-title>日本語</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
export default {
  name: "MAppBar",
  computed: {
    name: {
      get() {
        return this.$store.state.appName;
      }
    },
    version: {
      get() {
        return this.$store.state.appVersion;
      }
    },
    title: function() {
      return `${this.name} ver ${this.version}`;
    },
    isSearch: function() {
      return this.$store.state.search.show;
    },
    keyword: {
      get() {
        return this.$store.state.search.keyword;
      },
      set(val) {
        this.$store.commit("search/keyword", val);
      }
    },
    fileInfo: function() {
      const filename = this.$store.state.current.video.filename;
      if (filename) {
        const name = filename.split(".")[0];
        const fps = this.$store.state.current.video.fps;
        const duration = this.$store.state.current.video.duration;
        return `${name}: ${fps} fps : ${duration} sec`;
      }
      return null;
    },
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("setDrawer", val);
      }
    }
  },
  methods: {
    to: function(payload) {
      if (payload.name) {
        if (this.$route.name !== payload.name) {
          this.$router.push(payload);
        }
      }
    }
  }
};
</script>

<style scoped></style>
