<template>
  <m-card-dialog
    persistent
    titleColor="warning darken-1"
    :fullscreen="$store.state.current.layout.mini"
    :title="$vuetify.lang.t(title)"
    v-model="dialog"
    :max-width="maxWidth"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <template v-slot:toolbar-actions>
      <span> {{ header }} </span>
      <v-btn icon @click="close" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <div>
      <m-ruler-editor
        ref="editor"
        v-if="src"
        v-model="src"
        @update-max-width="onUpdateMaxWidth"
        @skip="onSkip"
      />
    </div>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MRulerEditor from "@/components/video/MRulerEditor";
export default {
  name: "m-ruler-dialog",
  components: { MCardDialog, MRulerEditor },
  data: () => ({
    maxWidth: "700"
  }),
  props: {
    value: { type: Boolean, required: true }
  },
  methods: {
    onUpdateMaxWidth: function(maxWidth) {
      if (this.maxWidth != maxWidth) {
        this.maxWidth = maxWidth;
      }
    },
    onSkip: function() {
      this.maxWidth = "700";
    },
    close: function() {
      this.$refs.editor.close();
      this.maxWidth = "700";
      this.dialog = false;
    }
  },
  computed: {
    src: {
      get() {
        return this.$store.state.current.frame.src;
      },
      set(val) {
        this.$store.commit("current/frame/src", val);
      }
    },
    title: function() {
      return "$vuetify.forms.ruler.title";
    },
    header: function() {
      const time = this.$store.state.current.frame.time;
      const id = this.$store.state.current.frame.id;
      if (id) {
        return `FRAME: ${id}: ${this.$vuewer.math.round(time, 3)} sec`;
      } else {
        return `${this.$vuewer.math.round(time, 3)} sec`;
      }
    },
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
<style scoped></style>
