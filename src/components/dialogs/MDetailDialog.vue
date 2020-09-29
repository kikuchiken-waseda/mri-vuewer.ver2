<template>
  <m-card-dialog
    titleColor="grey darken-4"
    :title="$vuetify.lang.t(title)"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <template v-slot:toolbar-actions>
      <m-video-upload-menu @click="$emit('upload-click', $event)" />
      <m-video-download-menu @click="$emit('download-click', $event)" />
    </template>
    <v-card tile>
      <v-img
        v-if="src"
        :src="src"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="200px"
      >
        <v-card-title class="py-0">{{ videoName }}</v-card-title>
        <v-card-title class="py-0">
          {{ duration }} sec: {{ fps }} fps [{{ originSize.width }} x
          {{ originSize.height }}]
        </v-card-title>
      </v-img>
      <m-video-stream-list :video-stream="videoStream" />
      <v-divider inset></v-divider>
      <m-audio-stream-list :audio-stream="audioStream" />
      <v-divider inset></v-divider>

      <v-list subheader>
        <v-subheader>MetaData</v-subheader>
        <v-list-item v-for="x in metaData" :key="x.key">
          <v-list-item-avatar>
            <v-icon></v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ x.key.toUpperCase() }}: </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            {{ x.val }}
          </v-list-item-action>
        </v-list-item>
        <v-divider inset></v-divider>
      </v-list>
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MVideoDownloadMenu from "@/components/menus/MVideoDownloadMenu";
import MVideoUploadMenu from "@/components/menus/MVideoUploadMenu";
import MVideoStreamList from "@/components/list/MVideoStreamList";
import MAudioStreamList from "@/components/list/MAudioStreamList";
import MVideoMixin from "@/mixins/MVideoMixin.js";
export default {
  name: "m-detail-dialog",
  mixins: [MVideoMixin],
  components: {
    MCardDialog,
    MVideoDownloadMenu,
    MVideoUploadMenu,
    MVideoStreamList,
    MAudioStreamList
  },
  data: () => ({
    title: "$vuetify.forms.detail.title"
  }),
  props: {
    value: { type: Boolean, required: true }
  },
  computed: {
    metaData: function() {
      const src = this.$store.state.current.metaData;
      if (src) {
        return Object.keys(src).map(x => {
          return {
            key: x,
            val: src[x]
          };
        });
      }
      return [];
    },
    src() {
      return this.$store.state.current.frame.src;
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
