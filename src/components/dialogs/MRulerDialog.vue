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
      <span v-if="frame">
        FRAME: {{ frame.idx }}: {{ $vuewer.math.round(frame.time, 3) }} sec
      </span>
      <v-btn icon @click="close" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <div>
      <m-ruler-editor
        ref="editor"
        @update-max-width="onUpdateMaxWidth"
        @skip="onSkip"
        :src="src"
        :frame="frame"
        :origin-size="originSize"
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
    title: "$vuetify.forms.ruler.title",
    maxWidth: "700"
  }),
  props: {
    value: {
      type: Boolean
    },
    src: {
      type: String,
      required: true
    },
    frame: {
      type: Object,
      required: true
    },
    originSize: {
      type: Object,
      required: true
    }
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
