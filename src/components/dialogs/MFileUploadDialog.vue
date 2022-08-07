<template>
  <m-card-dialog persistent :title="t(title)" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <template v-slot:toolbar-actions>
      <v-btn icon @click="close" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <m-video-regist-from
      @loaded="onLoaded"
      @error="onError"
      v-if="dialog"
    />
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MVideoRegistFrom from "@/components/form/MVideoRegistFrom";
export default {
  name: "m-file-upload-dialog",
  components: { MCardDialog, MVideoRegistFrom },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    title: "$vuetify.forms.video.title",
    loaded: false
  }),
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    t: function(val) {
      return this.$vuetify.lang.t(val);
    },
    close: function() {
      this.dialog = false;
      if (!this.loaded) {
        this.$vuewer.snackbar.warning(
          "$vuetify.forms.video.messages.stop"
        );
      }
    },
    onLoaded: function(id) {
      this.loaded = true;
      this.$vuewer.snackbar.success(
        "$vuetify.forms.video.messages.success"
      );
      if (this.$store.state.setting.shouldMovePageAferAddingFile) {
        this.dialog = false;
        this.$router.push({ path: `/files/${id}` });
      }
    },
    onError: function(error) {
      if (~error.message.indexOf("out of memory")) {
        this.$vuewer.snackbar.error(
          "$vuetify.forms.video.messages.outofmemory"
        );
      } else {
        this.$vuewer.snackbar.error(error);
      }
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
