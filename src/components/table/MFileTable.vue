<template>
  <v-data-table
    show-expand
    show-select
    loading-text="Loading... Please wait"
    v-model="selected"
    :headers="headers"
    :items="files"
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
    <template v-slot:footer v-if="isSelected">
      <v-card flat>
        <v-card-text>
          <v-text-field
            filled
            v-model="tierTemplate"
            type="text"
            append-icon="mdi-send"
            label="Set Tiers (name:[interval|point]-name2:[interval|point]...)"
            @click:append="onClickAddTiers"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
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
    tierTemplate: "",
    dialog: false,
    id: null,
    metaData: {},
    selected: [],
    expanded: []
  }),
  computed: {
    isSelected: function() {
      return this.selected.length > 0;
    },
    query: function() {
      return {
        args: this.$store.getters["search/args"],
        kwargs: this.$store.getters["search/kwargs"],
        norargs: this.$store.getters["search/norargs"]
      };
    },
    files: function() {
      let files = this.$store.state.files.files || [];
      const args = this.query.args;
      const kwargs = this.query.kwargs;
      const norargs = this.query.norargs;
      if (args.length) {
        files = files.filter(x => {
          const search = [
            x.name,
            String(x.fps),
            String(x.duration),
            String(x.originSize.width),
            String(x.originSize.height),
            ...Object.keys(x.metaData).map(m => x.metaData[m])
          ];
          return args
            .map(x => search.join(" ").indexOf(x) !== -1)
            .every(val => val === true);
        });
      }
      if (Object.keys(kwargs).length) {
        files = files.filter(x => {
          const search = {
            name: x.name,
            duration: String(x.duration),
            width: String(x.originSize.width),
            height: String(x.originSize.height),
            ...x.metaData
          };
          return Object.keys(kwargs)
            .map(key => {
              if (key in search) {
                return search[key].indexOf(kwargs[key]) !== -1;
              }
              return false;
            })
            .every(val => val === true);
        });
      }
      if (Object.keys(norargs).length) {
        files = files.filter(x => {
          const search = {
            name: x.name,
            duration: String(x.duration),
            width: String(x.originSize.width),
            height: String(x.originSize.height),
            ...x.metaData
          };
          return Object.keys(norargs)
            .map(key => {
              if (key in search) {
                return search[key].indexOf(norargs[key]) == -1;
              }
              return false;
            })
            .every(val => val === true);
        });
      }

      return files;
    },
    isLoading: function() {
      return this.$store.state.files.isLoading;
    },
    fields: function() {
      return this.$store.getters["files/fields"];
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
    // 選択された全てのファイルに指定の Tier を付与します.
    onClickAddTiers: async function() {
      this.$vuewer.loading.start("set tiers ...");
      const fields = this.tierTemplate.split("-");
      for (const file of this.selected) {
        const textgrid = {};
        for (const field of fields) {
          if (~field.indexOf(":")) {
            const [tName, tType] = field.split(":");
            if (~["interval", "point"].indexOf(tType)) {
              textgrid[tName] = {
                type: tType,
                parent: null,
                values: []
              };
            }
          }
        }
        try {
          const origin = await db.files.get(file.id);
          origin.textgrid = textgrid;
          await db.files.put(origin);
        } catch (error) {
          this.$vuewer.snackbar.error(error);
        }
      }
      this.$vuewer.loading.end();
    },
    // 選択されたファイルの詳細情報を取得します.
    openItem: function(item) {
      this.$router.push({ path: `/files/${item.id}` });
    },
    // 選択されたファイルのメタ情報を変更します.
    editItem: function(payload) {
      this.metaData = payload.metaData;
      this.id = payload.id;
      this.dialog = true;
    },
    // 選択されたファイルを削除します.
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
  }
};
</script>

<style scoped></style>
