<template>
  <v-data-table
    show-expand
    loading-text="Loading... Please wait"
    :headers="headers"
    :items="files"
    :search="keyword"
    :loading="isLoading"
    :expanded.sync="expanded"
    item-key="name"
  >
    <template v-slot:item.actions="{ item }">
      <m-video-meta-data-dialog
        v-if="dialog"
        v-model="dialog"
        @validated="onValidated($event)"
        :current-item="metaData"
      />
      <v-row>
        <v-col cols="4" class="px-0">
          <v-btn fab dark x-small @click="openItem(item)">
            <v-icon>
              mdi-import
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4" class="px-0">
          <v-btn color="green" fab dark x-small @click="editItem(item)">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4" class="px-0">
          <v-btn color="error" fab dark x-small @click="deleteItem(item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="px-0">
        <m-video-stream-list :video-stream="item.videoStream" />
        <v-divider inset />
        <m-audio-stream-list :audio-stream="item.audioStream" />
      </td>
    </template>
  </v-data-table>
</template>
<script>
import db from "@/storage/db";
import MVideoMetaDataDialog from "@/components/dialogs/MVideoMetaDataDialog";
import MAudioStreamList from "@/components/list/MAudioStreamList";
import MVideoStreamList from "@/components/list/MVideoStreamList";
export default {
  name: "m-file-table",
  components: {
    MVideoMetaDataDialog,
    MVideoStreamList,
    MAudioStreamList
  },
  data: () => ({
    dialog: false,
    id: null,
    files: [],
    fields: [],
    metaData: {},
    expanded: []
  }),
  computed: {
    keyword: {
      get() {
        return this.$store.state.search.keyword;
      },
      set(val) {
        this.$store.commit("search/keyword", val);
      }
    },
    isLoading: function() {
      return this.$store.state.files.isLoading;
    },
    headers: function() {
      const headers = [
        {
          text: "Name",
          class: "text-truncate",
          value: "name"
        },
        {
          text: "FPS",
          class: "text-truncate",
          value: "fps"
        },
        {
          text: "Duration",
          class: "text-truncate",
          value: "duration"
        },
        {
          text: "Width",
          class: "text-truncate",
          value: "originSize.width"
        },
        {
          text: "Height",
          class: "text-truncate",
          value: "originSize.height"
        }
      ];
      if (this.fields) {
        for (const x of this.fields) {
          headers.push({
            text: x,
            class: "text-truncate",
            value: `metaData.${x}`
          });
        }
      }
      headers.push({
        text: "Actions",
        value: "actions",
        width: "120px",
        sortable: false,
        align: "end"
      });
      return headers;
    }
  },
  methods: {
    openItem: function(item) {
      this.$router.push({ path: `/files/${item.id}` });
    },
    editItem: function(payload) {
      this.metaData = payload.metaData;
      this.id = payload.id;
      this.dialog = true;
    },
    deleteItem: function(item) {
      const name = item.name;
      const vm = this;
      this.$store
        .dispatch("files/destroy", item.id)
        .then(() => {
          const message = this.$vuetify.lang.t(
            "$vuetify.pages.on.destroy",
            name
          );
          vm.$vuewer.snackbar.warning(message);
        })
        .catch(error => {
          vm.$vuewer.console.error(error);
          vm.$vuewer.snackbar.error(error);
        });
    },
    onValidated: function(payload) {
      const idx = this.files.findIndex(x => x.id == this.id);
      if (idx > -1) {
        const item = this.files[idx];
        item.metaData = payload;
        db.files
          .put(item)
          .then(id => {
            db.files.get(id).then(x => {
              const msg = `update the metadata of a file (id=${x.id})`;
              this.$vuewer.snackbar.success(msg);
              this.files.splice(idx, 1, item);
            });
          })
          .catch(error => {
            this.$vuewer.snackbar.error(error);
            this.$vuewer.console.error(error);
          });
      }
    }
  },
  mounted: function() {
    const fields = this.$store.state.metadata.fields;
    this.fields = Array.from(fields);
    this.files = this.$store.state.files.files;
  }
};
</script>

<style scoped></style>
