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
      :height="contentHeight"
      v-if="dialog && src"
      v-model="src"
      :origin-size="originSize"
      @skip="onSkip"
      @update-max-width="onUpdateMaxWidth"
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
    value: { type: Boolean, required: true }
  },
  data: () => ({
    maxWidth: "700"
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
      if (this.$refs.editor) {
        this.$refs.editor.close();
      }
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
    originSize: function() {
      return this.$store.state.current.originSize;
    },
    contentHeight: function() {
      if (this.$store.state.current.layout.mini) return "90vh";
      return "80vh";
    },
    refKey: function() {
      return this.$store.state.current.frameConf.refTier;
    },
    refValues: function() {
      const ref = this.refKey;
      if (ref) {
        return this.$store.state.current.textgrid[ref].values;
      }
      return [];
    },
    refText: function() {
      const time = this.$store.state.current.frame.time;
      const record = this.refValues.filter(r => r.time >= time)[0];
      if (record) return record.text;
      return null;
    },
    targetKey: function() {
      return this.$store.state.current.frameConf.targetTier;
    },
    targetValues: function() {
      const key = this.targetKey;
      if (key) return this.$store.state.current.textgrid[key].values;
      return [];
    },
    targetText: function() {
      const time = this.$store.state.current.frame.time;
      const record = this.targetValues.filter(r => r.time == time)[0];
      if (record) return record.text;
      return null;
    },
    title: function() {
      return "$vuetify.forms.imageEdit.title";
    },
    header: function() {
      const time = this.$store.state.current.frame.time;
      const id = this.$store.state.current.frame.id;
      const sec = this.$vuewer.math.round(time, 3);
      let text = `${sec} sec`;
      if (id) {
        text = [`FRAME: ${id}`, text].join(": ");
        if (this.targetKey) {
          const target = `${this.targetKey}: ${this.targetText ||
            "null"}`;
          text = [target, text].join(": ");
        }
        if (this.refKey) {
          const ref = `${this.refKey}: ${this.refText || "null"}`;
          text = [ref, text].join(": ");
        }
      }
      return text;
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
