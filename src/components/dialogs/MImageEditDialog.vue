<template>
  <m-card-dialog
    ref="dialog"
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
    <m-frame-editor
      ref="editor"
      class="mx-auto overflow-y-auto"
      :height="contentsHeight"
      :origin-size="originSize"
      @skip="onSkip"
      @update-max-width="onUpdateMaxWidth"
      @rects-updated="$emit('rects-updated', $event)"
      @points-updated="$emit('points-updated', $event)"
      @rect-deleted="$emit('rect-deleted', $event)"
      @point-deleted="$emit('point-deleted', $event)"
    />
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MFrameEditor from "@/components/video/MFrameEditor";
export default {
  name: "m-image-edit-dialog",
  components: { MCardDialog, MFrameEditor },
  props: {
    value: { type: Boolean, required: true },
    originSize: { type: Object, required: true }
  },
  data: () => ({
    maxWidth: "700",
    contentsHeight: "80vh"
  }),
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
    title: function() {
      return "$vuetify.forms.imageEdit.title";
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
