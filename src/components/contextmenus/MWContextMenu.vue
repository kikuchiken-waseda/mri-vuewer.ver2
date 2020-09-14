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
                sub-group
                v-for="(x, key) in item.items"
                :key="key"
                @click="x.click"
              >
                <v-list-item-icon> </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $vuetify.lang.t(x.text) }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon> {{ x.icon }} </v-icon>
                </v-list-item-icon>
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
      return [
        {
          text: "$vuetify.contexts.playPause",
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
              icon: "mdi-skip-backward",
              click: this.skipBackward
            },
            {
              text: "$vuetify.contexts.skipForward",
              icon: "mdi-skip-forward",
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
              click: this.incPxPerSec
            },
            {
              text: "$vuetify.contexts.zoom_out",
              icon: "mdi-magnify-minus",
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
          text: "$vuetify.contexts.save",
          icon: "mdi-content-save",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-save");
            }, 10);
          }
        },
        {
          text: "インポート",
          show: false,
          icon: "mdi-upload",
          items: [
            {
              text: "テキスト補完辞書の追加",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-complate");
                }, 10);
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
              text: "$vuetify.downloads.textgrid.xlsx",
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
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "play");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.copy",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "copy");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.paste",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "paste");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.next",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "next");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.prev",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "prev");
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
              text: "$vuetify.contexts.record.toEnd",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "to-end");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.extend",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "extend");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.record.shrink",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "shrink");
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
