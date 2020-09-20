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
      <v-list-group prepend-icon="mdi-view-list" sub-group value="true">
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
        :value="true"
        prepend-icon="mdi-menu-open"
      >
        <template v-slot:activator>
          <v-list-item-title>FILES</v-list-item-title>
        </template>
        <v-divider />
        <v-list-item
          link
          v-for="item in files"
          :key="item.id"
          @click="to({ id: item.id })"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
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

      <v-list-group prepend-icon="mdi-database" sub-group :value="false">
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
        v-if="$showDev"
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
export default {
  name: "MNavigationDrawer",
  components: { MFileUploadDialog, MDbImportDialog, MDropboxDialog },
  data: () => ({
    current: null,
    dropboxDialog: false,
    uploadDialog: false,
    dbImportDialog: false,
    updateToken: false
  }),
  computed: {
    $showDev: function() {
      return this.$store.state.setting.$showDev;
    },
    isLoading: function() {
      return this.$store.state.files.isLoading;
    },
    files: function() {
      return this.$store.state.files.files || [];
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
        this.$store.commit("setDrawer", val);
      }
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
    hasToken: function() {
      if (this.updateToken) return true;
      return this.$vuewer.dropbox.hasToken();
    }
  },
  methods: {
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
          console.error(error);
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
          console.error(error);
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
          console.error(error);
          this.drawer = false;
        });
    }
  },
  mounted: function() {
    if (window.location.hash) {
      this.$vuewer.dropbox.setToken(window.location.hash);
      this.updateToken = true;
    }
    this.$store.dispatch("files/dropbox");
  }
};
</script>
<style scoped></style>
