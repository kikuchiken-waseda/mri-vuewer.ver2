<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    temporary
    class="py-0"
    width="400px"
  >
    <v-list dense nav color="blue-grey" dark>
      <v-list-item> </v-list-item>
    </v-list>

    <v-list dense nav color="blue-grey" dark>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img :src="require('../assets/logo2.svg')" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ $store.state.appName }}</v-list-item-title>
          <v-list-item-subtitle>
            Copyright &copy; {{ $store.state.devYear }} by
            {{ $store.state.author }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />

    <v-list dense nav class="pa-0">
      <v-list-group
        v-model="open.pages"
        prepend-icon="mdi-view-list"
        sub-group
        value="true"
      >
        <template v-slot:activator>
          <v-list-item-title>PAGES</v-list-item-title>
        </template>
        <v-divider />
        <v-list-item
          @click="item.to"
          v-for="item in pages"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list dense nav class="pa-0">
          <v-list-item link @click="$store.commit('logging/show', true)">
            <v-list-item-icon>
              <v-icon> mdi-console </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $vuetify.lang.t("$vuetify.pages.logger") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-group>
      <v-divider />

      <v-list-item v-if="isLoading" sub-group>
        <v-list-item-icon></v-list-item-icon>
        <v-list-item-title>
          Loading files...
        </v-list-item-title>
        <v-list-item-action>
          <v-progress-circular indeterminate color="primary" />
        </v-list-item-action>
      </v-list-item>

      <v-list-group
        sub-group
        v-else-if="files.length"
        v-model="open.files"
        prepend-icon="mdi-menu-open"
      >
        <template v-slot:activator>
          <v-list-item-title>
            FILES
            <v-chip v-if="!open.files" small class="ml-2" color="info">
              {{ files.length }}
            </v-chip>
          </v-list-item-title>
        </template>
        <v-divider />
        <v-list-item
          two-line
          v-for="item in files"
          :key="item.id"
          @click="to({ id: item.id })"
          :class="activeFile == item.id ? 'highlight' : ''"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }}
              <v-chip
                v-if="Object.keys(item.textgrid).length > 0"
                x-small
                class="ml-2"
                color="success"
              >
                {{ Object.keys(item.textgrid).length }} Tiers
              </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>
              last modify:
              {{ item.lastModifiedText }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn small @click.stop="fileDestroy(item)" icon>
              <v-icon small color="error">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list-group>
      <v-divider />

      <v-list-group
        v-if="!isLoading"
        prepend-icon="mdi-dropbox"
        v-model="open.dropboxes"
        sub-group
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title>DROPBOX</v-list-item-title>
        </template>
        <v-list-item link @click="dropboxAuth">
          <v-list-item-content>
            <v-list-item-title>
              {{ $vuetify.lang.t("$vuetify.pages.dropbox.auth") }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip v-if="hasToken" small color="success">
              {{ $vuetify.lang.t("$vuetify.pages.dropbox.connected") }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item v-if="hasToken" link @click="loadDropbox">
          <v-list-item-content>
            <v-list-item-title>
              {{ $vuetify.lang.t("$vuetify.pages.dropbox.load") }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip v-if="this.diff.length" small color="success">
              + {{ this.diff.length }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list-group>

      <v-list-group
        v-model="open.databases"
        prepend-icon="mdi-database"
        sub-group
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title>DATABASE</v-list-item-title>
        </template>
        <v-list-item @click="dbAdd" link>
          <v-list-item-icon>
            <v-icon>mdi-database-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ $vuetify.lang.t("$vuetify.pages.db.add") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="dbDump" link>
          <v-list-item-icon>
            <v-icon>mdi-database-export</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ $vuetify.lang.t("$vuetify.pages.db.dump") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="dbLoad" link>
          <v-list-item-icon>
            <v-icon>mdi-database-import</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ $vuetify.lang.t("$vuetify.pages.db.load") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="dbClear" link>
          <v-list-item-icon>
            <v-icon color="error">mdi-database-remove</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="error--text">
              {{ $vuetify.lang.t("$vuetify.pages.db.clear") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />

      <v-list-group
        v-model="open.convarters"
        prepend-icon="mdi-file-swap"
        sub-group
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title>CONVATER</v-list-item-title>
        </template>
        <v-list-item
          v-for="x in converters"
          :key="x.text"
          @click="x.function"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ x.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ x.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />

      <v-list-group
        v-if="$showDev"
        v-model="open.depelops"
        prepend-icon="mdi-flask"
        sub-group
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title>DEVELOP</v-list-item-title>
        </template>
        <v-list-item
          @click="item.to"
          v-for="item in developPages"
          :key="item.title"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-divider />

      <v-list-group v-model="open.docs" prepend-icon="mdi-library" sub-group>
        <template v-slot:activator>
          <v-list-item-title>Docs</v-list-item-title>
        </template>
        <v-divider />
        <v-list-item
          v-for="item in docs"
          :key="item.title"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          link
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ $vuetify.lang.t(item.title) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <m-file-upload-dialog v-model="uploadDialog" />
    <m-db-import-dialog v-model="dbImportDialog" />
    <m-dropbox-dialog v-model="dropboxDialog" />
  </v-navigation-drawer>
</template>
<script>
import MFileUploadDialog from "@/components/dialogs/MFileUploadDialog";
import MDropboxDialog from "@/components/dialogs/MDropboxDialog";
import MDbImportDialog from "@/components/dialogs/MDbImportDialog";
import moment from "moment";

export default {
  name: "MNavigationDrawer",
  components: { MFileUploadDialog, MDbImportDialog, MDropboxDialog },
  data: () => ({
    current: null,
    open: {
      pages: true,
      files: false,
      dropboxes: false,
      databases: false,
      convarters: false,
      depelops: false,
      docs: false
    },
    dropboxDialog: false,
    uploadDialog: false,
    dbImportDialog: false,
    updateToken: false
  }),
  computed: {
    $showDev: function() {
      return this.$store.state.setting.showDev;
    },
    isVuewer: function() {
      const pathes = this.$route.fullPath.split("/");
      if (pathes.length > 0 && pathes[1] == "files") {
        return true;
      }
      return false;
    },
    activeFile: function() {
      if (this.isVuewer) {
        return Number(this.$route.params.id);
      }
      return null;
    },
    isLoading: function() {
      return this.$store.state.files.isLoading;
    },
    files: function() {
      let dformat = "dddd, MMMM Do YYYY, h:mm:ss a";
      if (this.$vuetify.lang.current == "ja") {
        moment.locale("ja");
        dformat = "YYYY 年 MM 月 DD 日(ddd) a h:mm:ss";
      }
      const files = this.$store.state.files.files || [];
      return files.map(x => {
        x.lastModifiedText = moment(x.lastModifiedAt).format(dformat);
        return x;
      });
    },
    chaches: function() {
      return this.$store.state.files.chaches || [];
    },
    diff: function() {
      const cnames = this.chaches.map(x => x.name.split(".")[0]);
      const fnames = this.files.map(x => x.name.split(".")[0]);
      return cnames.filter(c => {
        return fnames.indexOf(c) == -1;
      });
    },
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("drawer", val);
      }
    },
    converters: function() {
      const moveTo = path => {
        if (this.$route.path !== path) this.$router.push({ path });
      };
      return [
        {
          text: "video2png",
          icon: "mdi-filmstrip-box-multiple",
          function: () => moveTo("/convarters/video2png")
        },
        {
          text: "video2wav",
          icon: "mdi-file-music",
          function: () => moveTo("/convarters/video2wav")
        }
      ];
    },
    developPages: function() {
      if (process.env.NODE_ENV) {
        return this.$router.options.routes
          .filter(x => {
            if (x.develop) return true;
            return false;
          })
          .map((x, i) => {
            if (x.name == this.$route.name) {
              this.current = i;
              x.current = true;
            }
            x.title = x.name;
            x.to = () => {
              this.to({ name: x.name });
            };
            return x;
          });
      }
      return [];
    },
    pages: function() {
      return this.$router.options.routes
        .filter(x => {
          if (x.develop) return false;
          return x.name;
        })
        .map((x, i) => {
          if (x.name == this.$route.name) {
            this.current = i;
            x.current = true;
          }
          x.title = this.$vuetify.lang.t(
            `$vuetify.pages.${x.name.toLowerCase()}`
          );
          x.to = () => {
            this.to({ name: x.name });
          };
          return x;
        });
    },
    docs: function() {
      return [
        {
          title: "$vuetify.docs.fileRegistration",
          link:
            "https://github.com/kikuchiken-waseda/mri-vuewer.ver2/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E7%99%BB%E9%8C%B2"
        },
        {
          title: "$vuetify.docs.textgrid",
          link:
            "https://github.com/kikuchiken-waseda/mri-vuewer.ver2/wiki/%E6%99%82%E7%B3%BB%E5%88%97%E8%BB%A2%E8%A8%98"
        },
        {
          title: "$vuetify.docs.dropbox",
          link:
            "https://github.com/kikuchiken-waseda/mri-vuewer.ver2/wiki/Dropbox%E9%80%A3%E6%90%BA"
        }
      ];
    },

    hasToken: function() {
      if (this.updateToken) return true;
      return this.$vuewer.dropbox.hasToken();
    }
  },
  methods: {
    moment: function(now) {
      return moment(now);
    },
    allClose: function(except = null) {
      for (const key in this.open) {
        if (except !== null && key == except) {
          this.open[key] = true;
        } else {
          this.open[key] = false;
        }
      }
    },
    to: function(payload) {
      if (payload.name) {
        if (this.$route.name !== payload.name) {
          this.$router.push(payload);
        }
      }
      if (payload.id) {
        if (Number(this.$route.params.id) !== Number(payload.id)) {
          this.$router.push({ path: `/files/${payload.id}` });
        }
      }
    },
    loadDropbox: function() {
      const path = this.$store.getters["current/video/dropboxPath"];
      if (path) {
        this.$vuewer.loading.start("$vuetify.loading");
        this.$vuewer.dropbox
          .read(path)
          .then(text => {
            const obj = JSON.parse(text);
            this.$store.dispatch("current/loadObj", obj);
            this.$vuewer.snackbar.success("$vuetify.loaded");
          })
          .catch(res => {
            const msg = `DROPBOX ERROR: ${res.status} :${res.error.error_summary}`;
            this.$vuewer.snackbar.error(msg);
          })
          .finally(() => {
            this.$vuewer.loading.end();
            this.drawer = false;
          });
      } else {
        this.dropboxDialog = true;
      }
    },
    dropboxAuth: function() {
      this.$vuewer.dropbox.auth();
    },
    dbAdd: function() {
      this.uploadDialog = true;
      this.drawer = false;
    },
    dbLoad: function() {
      this.dbImportDialog = true;
      this.drawer = false;
    },
    dbDump: function() {
      this.$store
        .dispatch("files/dump")
        .then(() => {
          const message = this.$vuetify.lang.t("$vuetify.pages.on.dump");
          this.$store.dispatch("snackbar/success", message);
        })
        .catch(error => {
          this.$store.dispatch("snackbar/error", error.message);
        })
        .finally(() => {
          this.drawer = false;
        });
    },
    dbClear: function() {
      this.$store
        .dispatch("files/clear")
        .then(() => {
          const message = this.$vuetify.lang.t("$vuetify.pages.on.clear");
          this.$store.dispatch("snackbar/success", message);
          this.drawer = false;
          this.to({ name: "Home" });
        })
        .catch(error => {
          this.$store.dispatch("snackbar/error", error.message);
        });
    },
    fileDestroy: function(item) {
      this.$store
        .dispatch("files/destroy", item.id)
        .then(id => {
          const message = this.$vuetify.lang.t(
            "$vuetify.pages.on.destroy",
            `file id = ${id}`
          );
          this.$store.dispatch("snackbar/success", message);
          if (id == this.$route.params.id) {
            this.$router.push({ name: "Home" });
          }
        })
        .catch(error => {
          this.$store.dispatch("snackbar/error", error.message);
          this.drawer = false;
        });
    }
  },
  watch: {
    isVuewer: function(val, oldVal) {
      if (val !== oldVal) {
        if (val == true) {
          this.allClose("files");
        } else {
          this.allClose("pages");
        }
      }
    }
  },
  mounted: function() {
    if (window.location.hash) {
      this.$vuewer.dropbox.setToken(window.location.hash);
      this.updateToken = true;
    } else if (this.isVuewer) {
      this.allClose("files");
    }
    this.$store.dispatch("files/dropbox");
  }
};
</script>
<style scoped>
.highlight {
  background: #e0e0e0;
}
.highlight:hover {
  background: #e0e0e0;
}
</style>
