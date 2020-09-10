<template>
  <m-card-dialog
    persistent
    :fullscreen="$store.state.current.layout.mini"
    :titleColor="color"
    :title="$vuetify.lang.t(title)"
    v-model="dialog"
    max-width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <template v-slot:toolbar-actions>
      <m-video-upload-menu @click="$emit('upload-click', $event)" />
      <m-video-download-menu @click="$emit('download-click', $event)" />
      <v-btn icon @click="detail = !detail" color="white">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
      <v-btn icon @click="dialog = false" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card>
      <m-text-grid
        @click-image-edit="onClickImageEdit"
        @click-ruler="onClickRuler"
        :frames="frames"
        :textgrid="textgrid"
        :video-height="height"
        :color="color"
      />
      <v-divider v-if="detail" inset> </v-divider>
      <m-video-stream-list v-if="detail" :video-stream="videoStream" />
      <v-divider inset v-if="detail"></v-divider>
      <m-audio-stream-list v-if="detail" :audio-stream="audioStream" />
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MTextGrid from "@/components/MTextGrid";
import MVideoStreamList from "@/components/list/MVideoStreamList";
import MAudioStreamList from "@/components/list/MAudioStreamList";
import MVideoDownloadMenu from "@/components/menus/MVideoDownloadMenu";
import MVideoUploadMenu from "@/components/menus/MVideoUploadMenu";
import MVideoMixin from "@/mixins/MVideoMixin.js";
export default {
  name: "m-textgrid-dialog",
  mixins: [MVideoMixin],
  components: {
    MCardDialog,
    MTextGrid,
    MVideoDownloadMenu,
    MVideoUploadMenu,
    MVideoStreamList,
    MAudioStreamList
  },
  props: {
    value: {
      type: Boolean
    },
    textgrid: {
      type: Object,
      default: function() {
        return {};
      }
    },
    frames: {
      type: Array,
      default: function() {
        return [];
      }
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
    },
    icon: function() {
      return this.detail ? "mdi-chevron-up" : "mdi-chevron-down";
    },
    height: function() {
      const height = window.innerHeight;
      if (this.detail) return height - (64 * 5 + 16);
      return height;
    }
  },
  data: () => ({
    title: "$vuetify.forms.detail.title",
    detail: false,
    color: "grey darken-4"
  }),
  methods: {
    onClickImageEdit: function(payload) {
      this.$emit("click-image-edit", payload);
      this.dialog = false;
    },
    onClickRuler: function(payload) {
      this.$emit("click-ruler", payload);
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
