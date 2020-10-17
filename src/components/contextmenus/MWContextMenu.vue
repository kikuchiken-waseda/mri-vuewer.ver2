<template>
  <m-context-menu
    ref="menu"
    title="VUWER-MENU"
    :accept="accept"
    :items="items"
    @change="onChange"
  >
    <slot></slot>
  </m-context-menu>
</template>
<script>
import MContextMenu from "@/components/base/MContextMenu";
import FrameMixin from "@/mixins/MFrameMixin.js";
import MWavesurferMixin from "@/mixins/MWavesurferMixin";
export default {
  name: "m-w-context-menu",
  mixins: [FrameMixin, MWavesurferMixin],
  components: { MContextMenu },
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
          text: "$vuetify.contexts.denoising.audio",
          icon: "mdi-headphones-settings",
          show: false,
          items: [
            {
              text: "AFFTDN FILTER",
              icon: "",
              click: () => {
                setTimeout(() => {
                  const payload = {
                    type: "afftdn"
                  };
                  vm.$emit("click-noise-reduction", payload);
                }, 10);
              }
            },
            {
              text: "NON-LOCAL MEANS FILTER",
              icon: "",
              click: () => {
                setTimeout(() => {
                  const payload = {
                    type: "anlmdn"
                  };
                  vm.$emit("click-noise-reduction", payload);
                }, 10);
              }
            },
            {
              text: "BANDPASS FILTER",
              icon: "",
              click: () => {
                setTimeout(() => {
                  const payload = {
                    type: "bandpass",
                    low: 300,
                    heigh: 100
                  };
                  vm.$emit("click-noise-reduction", payload);
                }, 10);
              }
            }
          ]
        },
        {
          text: "$vuetify.contexts.setting",
          icon: "mdi-cog",
          click: () => {
            setTimeout(() => {
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
                vm.$nextTick(() => vm.$refs.menu.open());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v2",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON";
                vm.$nextTick(() => vm.$refs.menu.open());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v1",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON/VER1";
                vm.$nextTick(() => vm.$refs.menu.open());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v1left",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON/VER1/LEFT";
                vm.$nextTick(() => vm.$refs.menu.open());
              }
            },
            {
              text: "$vuetify.uploads.textgrid.json.v1left",
              icon: "",
              click: () => {
                vm.accept = "application/json";
                vm.clicked = "TEXTGRID/JSON/VER1/RIGHT";
                vm.$nextTick(() => vm.$refs.menu.open());
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
          icon: "mdi-pencil-box",
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
          text: "$vuetify.contexts.tier.interval.name",
          show: false,
          icon: "mdi-pencil-box-multiple",
          items: [
            {
              text: "$vuetify.contexts.tier.interval.time2frame",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-interval", "time2frame");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.tier.interval.owakati",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-interval", "owakati");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.tier.interval.oyomi",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-interval", "oyomi");
                }, 10);
              }
            },
            {
              text: "$vuetify.contexts.tier.interval.opronunciation",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-interval", "opronunciation");
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
          kbd: "CTRL + SHIFT + i",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-image-edit");
            }, 10);
          },
          divider: true
        },
        {
          text: "$vuetify.contexts.frame.deletePoints",
          icon: "mdi-close-circle",
          click: () => {
            setTimeout(function() {
              vm.$store.dispatch("current/deletePoints");
            }, 10);
          },
          divider: true
        },
        {
          text: "$vuetify.contexts.frame.deleteRects",
          icon: "mdi-close-box",
          click: () => {
            setTimeout(function() {
              vm.$store.dispatch("current/deleteRects");
            }, 10);
          },
          divider: true
        }
      ];
    }
  },
  methods: {
    onChange(files) {
      const item = {
        click: this.clicked,
        files: files
      };
      this.$emit("click-upload", item);
    },
    incPxPerSec() {
      if (this.$minPxPerSec < 700) {
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
