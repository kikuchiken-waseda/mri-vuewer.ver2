<template>
  <v-card>
    <v-toolbar dense>
      <v-btn-toggle v-model="mode" dense group color="primary">
        <v-btn :value="m.val" text v-for="m in modes" :key="m.val">
          <v-icon>{{ m.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
      <div class="mx-1"></div>
      <m-color-menu icon v-model="color" />
      <v-text-field
        ref="text"
        solo
        hide-details
        v-model="sendText"
        v-if="targetTier"
        label="転記テキスト"
      >
        <template v-slot:append>
          <v-btn icon @click="addEvent"><v-icon>mdi-send</v-icon></v-btn>
        </template>
      </v-text-field>
      <v-spacer />
      <v-btn-toggle dense group color="primary">
        <v-btn icon @click="$emit('skip', 'prev')">
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('skip', 'next')">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn-toggle dense group color="primary">
        <v-btn icon @click="$emit('zoom', 'out')">
          <v-icon>mdi-magnify-minus</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('zoom', 'in')">
          <v-icon>mdi-magnify-plus</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-toolbar dense>
      <v-btn-toggle v-model="filter" dense group color="primary">
        <v-btn :value="f.name" text v-for="f in filters" :key="f.name">
          {{ $vuetify.lang.t(f.name) }}
        </v-btn>
      </v-btn-toggle>
      <v-spacer />
      <v-btn text @click="$emit('download', 'image')">
        png <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>
<script>
import MColorMenu from "@/components/menus/MColorMenu";
export default {
  name: "m-frame-editor-actions",
  components: {
    MColorMenu
  },
  watch: {
    mode: function(val) {
      if (val == undefined) this.mode = 0;
    }
  },
  methods: {
    addEvent() {
      const text = this.$store.state.current.frameConf.text || "";
      const time = this.$store.state.current.frame.time;
      const payload = {
        tier: this.$store.state.current.frameConf.targetTier,
        record: { time, text }
      };
      this.$store.dispatch("current/addRecord", payload);
    },
    focus() {
      if (this.$refs.text) {
        this.$refs.text.focus();
      }
    }
  },
  computed: {
    $ws: function() {
      return this.$store.state.current.wavesurfer || null;
    },
    targetTier: function() {
      return this.$store.state.current.frameConf.targetTier;
    },
    sendText: {
      get() {
        return this.$store.state.current.frameConf.text;
      },
      set(str) {
        this.$store.commit("current/frameConf/text", str);
      }
    },
    color: {
      get() {
        return this.$store.state.current.frame.color;
      },
      set(color) {
        this.$store.commit("current/frame/color", color);
      }
    },
    mode: {
      get() {
        return this.$store.state.current.frame.mode;
      },
      set(mode) {
        this.$store.commit("current/frame/mode", mode);
      }
    },
    filter: {
      get() {
        return this.$store.state.current.frame.filter;
      },
      set(name) {
        this.$store.commit("current/frame/filter", name);
      }
    },
    modes: function() {
      return this.$store.state.current.frame.modes;
    },
    filters: function() {
      return this.$store.state.current.frame.filters;
    }
  }
};
</script>
<style scoped></style>
