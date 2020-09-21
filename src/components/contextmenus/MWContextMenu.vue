<template>
  <m-context-menu>
    <slot> </slot>
    <template v-slot:menus>
      <v-card
        ref="card"
        class="mx-auto overflow-y-auto"
        min-width="400"
        max-height="600"
      >
        <v-toolbar dense color="primary" dark>
          <v-toolbar-title>VUWER-MENU</v-toolbar-title>
        </v-toolbar>
        <input
          ref="input"
          :accept="accept"
          @change="onChange"
          type="file"
          style="display:none"
        />
        <v-list dense subheader class="overflow-y-auto" max-height="450">
          <div v-for="(item, key) in items" :key="key">
            <v-subheader
              v-if="item.subheader"
              class="grey--text text--darken-3"
            >
              {{ $vuetify.lang.t(item.subheader) }}
            </v-subheader>
            <v-divider v-else />

            <v-list-group
              v-if="item.items"
              v-model="item.show"
              :prepend-icon="item.icon"
              @click.stop.prevent
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $vuetify.lang.t(item.text) }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="(x, key) in item.items"
                :key="key"
                @click="x.click"
              >
                <v-list-item-icon>
                  <v-icon></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon v-if="x.icon"> {{ x.icon }} </v-icon>
                    {{ $vuetify.lang.t(x.text) }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="x.kbd">
                  <v-spacer />
                  <v-list-item-action-text v-text="x.kbd" />
                </v-list-item-action>
              </v-list-item>
            </v-list-group>

            <v-list-item v-else-if="item.text" @click="item.click">
              <v-list-item-icon>
                <v-icon> {{ item.icon }} </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $vuetify.lang.t(item.text) }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="item.kbd">
                <v-list-item-action-text v-text="item.kbd" />
              </v-list-item-action>
            </v-list-item>
          </div>
        </v-list>
      </v-card>
    </template>
  </m-context-menu>
</template>
<script>
import MContextMenu from "@/components/base/MContextMenu";
import FrameMixin from "@/mixins/MFrameMixin.js";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "m-w-context-menu",
  mixins: [FrameMixin, MWavesurferMixin],
  components: {
    MContextMenu
  },
  data: () => ({
    accept: "",
    clicked: null
  }),
  computed: {
    fps: function() {
      return this.$store.state.current.video.fps;
    },
    $minPxPerSec: {
      get() {
        return this.$store.state.setting.minPxPerSec;
      },
      set(val) {
        const type = typeof val;
        let minPxPerSec = null;
        if (type == "number") {
          minPxPerSec = val;
        } else if (type == "string") {
          minPxPerSec = Number(val);
        }
        if (minPxPerSec) {
          this.$store.commit("setting/setMinPxPerSec", minPxPerSec);
        }
      }
    },
    items: function() {
      const vm = this;
      const hasToken = this.$vuewer.dropbox.hasToken();
      const saveText = hasToken
        ? "$vuetify.contexts.saveDropbox"
        : "$vuetify.contexts.save";
      return [
        {
          text: "$vuetify.contexts.playPause",
          kbd: "TAB",
          icon: "mdi-play-pause",
          click: this.playPause
        },
        {
          text: "$vuetify.contexts.skip",
          show: false,
          icon: "mdi-skip-next",
          items: [
            {
              text: "$vuetify.contexts.skipBackward",
              icon: "mdi-skip-previous",
              kbd: "J",
              click: this.skipBackward
            },
            {
              text: "$vuetify.contexts.skipForward",
              icon: "mdi-skip-next",
              kbd: "K",
              click: this.skipForward
            }
          ]
        },
        {
          text: "$vuetify.contexts.zoom",
          show: false,
          icon: "mdi-magnify-plus",
          items: [
            {
              text: "$vuetify.contexts.zoom_in",
              icon: "mdi-magnify-plus",
              kbd: "CTRL + +",
              click: this.incPxPerSec
            },
            {
              text: "$vuetify.contexts.zoom_out",
              icon: "mdi-magnify-minus",
              kbd: "CTRL + -",
              click: this.decPxPerSec
            }
          ]
        },
        {
          text: "$vuetify.contexts.setting",
          icon: "mdi-cog",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-setting");
            }, 10);
          }
        },
        {
          text: saveText,
          icon: "mdi-content-save",
          kbd: "CTRL + S",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-save");
            }, 10);
          }
        },
        {
          text: "$vuetify.contexts.loadDropbox",
          icon: "mdi-dropbox",
          kbd: "CTRL + R",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-load-dropbox");
            }, 10);
          }
        },
        {
          text: "$vuetify.uploads.name",
          show: false,
          icon: "mdi-upload",
          items: [
            {
              text: "$vuetify.uploads.dict",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-complate");
                }, 10);
              }
            },
            {
              text: "$vuetify.uploads.textgrid.textgrid",
              icon: "",
              click: () => {
                vm.accept = ".TextGrid,.textgrid,.Textgrid";
                vm.clicked = "TEXTGRID/TEXTGRID";
                vm.$nextTick(() => vm.$refs.input.click());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v2",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON";
                vm.$nextTick(() => vm.$refs.input.click());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v1",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON/VER1";
                vm.$nextTick(() => vm.$refs.input.click());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v1left",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON/VER1/LEFT";
                vm.$nextTick(() => vm.$refs.input.click());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v1left",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON/VER1/RIGHT";
                vm.$nextTick(() => vm.$refs.input.click());
              }
            }
          ]
        },
        {
          text: "$vuetify.downloads.name",
          show: false,
          icon: "mdi-download",
          items: [
            {
              text: "$vuetify.downloads.xlsx",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "XLSX");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.textgrid.xlsx",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "TEXTGRID/XLSX");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.frame.xlsx",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "FRAME/XLSX");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.json",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "JSON");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.textgrid.json",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "TEXTGRID/JSON");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.frame.json",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "FRAME/JSON");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.png",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "PNG");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.mp4",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "MP4");
                }, 10);
              }
            },
            {
              text: "$vuetify.downloads.textgrid.textgrid",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "TEXTGRID/TEXTGRID");
                }, 10);
              }
            }
          ]
        },
        {
          subheader: "$vuetify.textgrid.name"
        },
        {
          text: "$vuetify.contexts.tier.add",
          icon: "mdi-plus",
          kbd: "CTRL + SHIFT + C",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-tier-add");
            }, 10);
          }
        },
        {
          text: "$vuetify.contexts.tier.edit",
          icon: "mdi-pencil",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-tier-edit");
            }, 10);
          }
        },
        {
          text: "$vuetify.contexts.tier.delete",
          icon: "mdi-delete",
          kbd: "CTRL + SHIFT + DELETE",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-tier-delete");
            }, 10);
          }
        },
        {
          text: "$vuetify.contexts.record.name",
          show: false,
          icon: "mdi-movie-edit",
          items: [
            {
              text: "$vuetify.contexts.record.play",
              icon: "",
              kbd: "TAB",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "play");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.copy",
              icon: "",
              kbd: "CTRL + C",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "copy");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.paste",
              icon: "",
              kbd: "CTRL + V",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "paste");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.prev",
              kbd: "CTRL + J",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "prev");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.next",
              icon: "",
              kbd: "CTRL + K",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "next");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.toEnd",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "to-end");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.toStart",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "to-start");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.shrink",
              kbd: "CTRL + SHIFT + J",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "shrink");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.extend",
              kbd: "CTRL + SHIFT + K",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "extend");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.splitByFrames",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "split-by-frames");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.splitByChars",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "split-by-chars");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.splitBySlash",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "split-by-slash");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.owakati",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "owakati");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.oyomi",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "oyomi");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.opronunciation",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "opronunciation");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.obasic",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "obasic");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.opos",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "opos");
                }, 10);
              }
            }
          ]
        },
        {
          subheader: "$vuetify.contexts.frame.name",
          divider: true
        },
        {
          text: "$vuetify.contexts.frame.edit",
          icon: "mdi-selection-drag",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-image-edit");
            }, 10);
          },
          divider: true
        }
      ];
    }
  },
  methods: {
    onChange() {
      const item = {
        click: this.clicked,
        files: this.$refs.input.files
      };
      this.$emit("click-upload", item);
    },
    incPxPerSec() {
      if (this.$minPxPerSec < 500) {
        this.$minPxPerSec = this.$minPxPerSec + 50;
      }
    },
    decPxPerSec: function() {
      if (this.$minPxPerSec > 100) {
        this.$minPxPerSec = this.$minPxPerSec - 50;
      }
    }
  }
};
</script>

<style scoped></style>
