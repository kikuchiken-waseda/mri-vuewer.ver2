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
    <template v-slot:item.name="{ item }">
      <v-row align-content="center">
        <span
          class="d-inline-block text-truncate"
          style="max-width: 100px;"
        >
          {{ item.name }}
        </span>
        <v-chip
          small
          v-if="Object.keys(item.textgrid).length > 0"
          color="success"
        >
          {{ Object.keys(item.textgrid).length }} Tiers
        </v-chip>
      </v-row>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row>
        <v-col cols="3" class="px-0">
          <v-btn fab dark x-small @click="playVideo(item)">
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="3" class="px-0">
          <v-btn fab dark x-small @click="openItem(item)">
            <v-icon>
              mdi-import
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="3" class="px-0">
          <v-btn
            color="green"
            fab
            dark
            x-small
            @click="editItem(item)"
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="3" class="px-0">
          <v-btn
            color="error"
            fab
            dark
            x-small
            @click="deleteItem(item)"
          >
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
    <template v-slot:footer>
      <v-card flat>
        <m-video-dialog v-model="dialogs.video" :src="src" />
        <m-video-meta-data-dialog
          v-model="dialogs.meta"
          @validated="onValidated($event)"
          :current-item="metaData"
        />
        <v-card-text v-if="isSelected">
          <v-text-field
            filled
            v-model="tierTemplate"
            type="text"
            append-icon="mdi-send"
            :label="
              $vuetify.lang.t(
                '$vuetify.table.file.forms.setTier.label'
              )
            "
            :hint="
              $vuetify.lang.t(
                '$vuetify.table.file.forms.setTier.hint'
              )
            "
            @keydown.enter="onClickAddTiers"
            @click:append="onClickAddTiers"
          />
        </v-card-text>
        <v-card-actions v-if="isSelected">
          <v-spacer />
        </v-card-actions>
      </v-card>
    </template>
  </v-data-table>
</template>
<script>
import moment from "moment";
import db from "@/storage/db";
import MVideoMetaDataDialog from "@/components/dialogs/MVideoMetaDataDialog";
import MVideoDialog from "@/components/dialogs/MVideoDialog";
import MAudioStreamList from "@/components/list/MAudioStreamList";
import MVideoStreamList from "@/components/list/MVideoStreamList";
export default {
  name: "m-file-table",
  components: {
    MVideoDialog,
    MVideoMetaDataDialog,
    MVideoStreamList,
    MAudioStreamList
  },
  data: () => ({
    tierTemplate: "",
    dialogs: {
      video: false,
      meta: false
    },
    id: null,
    src: "",
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
    dformat: function() {
      let f = "dddd, MMMM Do YYYY, h:mm:ss a";
      if (this.$vuetify.lang.current == "ja") {
        moment.locale("ja");
        f = "YYYY/MM/DD h:mm:ss";
      }
      return f;
    },
    files: function() {
      let files = this.$store.state.files.files || [];

      // 検索フィールドおよび表示フィールドを作成
      files = files.map(x => {
        x.size = `${x.originSize.width} * ${x.originSize.height}`;
        x.lastModifiedText = moment(x.lastModifiedAt).format(
          this.dformat
        );
        x.search = {
          name: x.name,
          fps: String(x.fps),
          duration: String(x.duration),
          size: x.size,
          lastModifiedAt: x.lastModifiedText,
          ...x.metaData
        };
        return x;
      });

      // 検索クエリに応じたファイル検索
      files = this.argFilter(this.query.args, files);
      files = this.kwargFilter(this.query.kwargs, files);
      files = this.norFilter(this.query.norargs, files);
      return files;
    },
    isLoading: function() {
      return this.$store.state.files.isLoading;
    },
    fields: function() {
      return this.$store.getters["files/fields"];
    },
    headers: function() {
      const locale = "$vuetify.table.file";
      const headers = [
        {
          text: this.$vuetify.lang.t(`${locale}.name`),
          value: "name"
        },
        {
          text: this.$vuetify.lang.t(`${locale}.lastModifiedAt`),
          value: "lastModifiedText"
        },
        {
          text: this.$vuetify.lang.t(`${locale}.fps`),
          value: "fps"
        },
        {
          text: this.$vuetify.lang.t(`${locale}.duration`),
          value: "duration"
        },
        {
          text: this.$vuetify.lang.t(`${locale}.size`),
          value: "size"
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
        text: this.$vuetify.lang.t(`${locale}.actions`),
        value: "actions",
        width: "150px",
        sortable: false,
        align: "end"
      });
      return headers;
    }
  },
  methods: {
    // ヘッダ付き否定系検索
    norFilter(norargs, files) {
      let $files = files;
      if (Object.keys(norargs).length) {
        // 全ての検索クエリが検索フィールドの何れかに部分一致しない
        $files = files.filter(f => {
          return Object.keys(norargs)
            .map(key =>
              key in f.search
                ? f.search[key].indexOf(norargs[key]) == -1
                : false
            )
            .every(val => val === true);
        });
      }
      if ($files.length) return $files;
      return files;
    },
    // ヘッダ付き検索
    kwargFilter(kwargs, files) {
      let $files = files;
      if (Object.keys(kwargs).length) {
        // 全ての検索クエリが検索フィールドの何れかに前方一致
        $files = files.filter(f => {
          return Object.keys(kwargs)
            .map(key =>
              key in f.search
                ? String(f.search[key]).startsWith(kwargs[key])
                : false
            )
            .every(val => val === true);
        });
      }
      if ($files.length) return $files;
      return files;
    },
    // ヘッダ無し検索
    argFilter(args, files) {
      let $files = files;
      if (args.length) {
        $files = files.filter(f => {
          // 全ての検索語が検索リストの内容のいずれかに前方一致する
          const values = Object.values(f.search);
          return args
            .map(arg => values.some(v => String(v).startsWith(arg)))
            .every(val => val === true);
        });
      }
      if ($files.length) return $files;
      return files;
    },
    // 選択された全てのファイルに指定の Tier を付与します.
    onClickAddTiers: async function() {
      const query = this.$vuewer.text.query(this.tierTemplate);
      const tiers = Object.keys(query)
        .filter(
          key =>
            String(query[key]).toLowerCase() == "interval" ||
            String(query[key]).toLowerCase() == "point"
        )
        .map(key => ({ key, type: query[key] }));
      if (tiers.length) {
        this.$vuewer.loading.start("set tiers ...");
        for (const file of this.selected) {
          const textgrid = file.textgrid || {};
          for (const tier of tiers) {
            if (
              Object.keys(textgrid).findIndex(x => x == tier.key) ==
              -1
            ) {
              textgrid[tier.key] = {
                type: tier.type,
                parent: null,
                values: []
              };
            }
          }
          try {
            const item = await db.files.get(file.id);
            item.lastModifiedAt = Date.now();
            item.textgrid = textgrid;
            const id = await db.files.put(item);

            const msg = `update the textgrid of a file (id=${id})`;
            this.$vuewer.db.log("textgrid", "PUT", msg);
            this.$vuewer.console.log("textgrid", msg);
          } catch (error) {
            this.$vuewer.console.error("meta:textgrid:put", error);
            this.$vuewer.snackbar.error(error);
          }
        }
        this.$vuewer.loading.end();
      }
    },
    // 選択された動画を再生します
    playVideo: function(item) {
      this.src = item.source;
      this.dialogs.video = true;
    },
    // 選択されたファイルの詳細情報を取得します.
    openItem: function(item) {
      this.$router.push({ path: `/files/${item.id}` });
    },
    // 選択されたファイルのメタ情報を変更します.
    editItem: function(payload) {
      this.metaData = payload.metaData;
      this.id = payload.id;
      this.dialogs.meta = true;
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
