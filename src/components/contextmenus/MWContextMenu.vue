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
              {{ item.subheader }}
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
                    {{ item.text }}
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
                  <v-list-item-title>{{ x.text }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>
                    {{ x.icon }}
                  </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-group>

            <v-list-item v-else-if="item.text" @click="item.click">
              <v-list-item-icon>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
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
          text: "再生/停止",
          icon: "mdi-play-pause",
          click: this.playPause
        },
        {
          text: "進む/戻る",
          show: false,
          icon: "mdi-skip-next",
          items: [
            {
              text: "進む",
              icon: "mdi-skip-backward",
              click: this.skipBackward
            },
            {
              text: "戻る",
              icon: "mdi-skip-forward",
              click: this.skipForward
            }
          ]
        },
        {
          text: "拡大/縮小",
          show: false,
          icon: "mdi-magnify-plus",
          items: [
            {
              text: "拡大",
              icon: "mdi-magnify-plus",
              click: this.incPxPerSec
            },
            {
              text: "縮小",
              icon: "mdi-magnify-minus",
              click: this.decPxPerSec
            }
          ]
        },
        {
          text: "設定",
          icon: "mdi-cog",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-setting");
            }, 10);
          }
        },
        {
          text: "保存",
          icon: "mdi-content-save",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-save");
            }, 10);
          }
        },
        {
          subheader: "時系列転記"
        },
        {
          text: "転記層を追加",
          icon: "mdi-plus",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-tier-add");
            }, 10);
          }
        },
        {
          text: "転記層を変更",
          icon: "mdi-pencil",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-tier-edit");
            }, 10);
          }
        },
        {
          text: "転記層を削除",
          icon: "mdi-delete",
          click: () => {
            setTimeout(function() {
              vm.$emit("click-tier-delete");
            }, 10);
          }
        },
        {
          text: "レコード操作",
          show: false,
          icon: "mdi-movie-edit",
          items: [
            {
              text: "現在レコードを再生",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-tier-delete");
                }, 10);
              }
            },
            {
              text: "現在レコードをコピー",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "copy");
                }, 10);
              }
            },
            {
              text: "現在レコードにペースト",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "paste");
                }, 10);
              }
            },
            {
              text: "次のレコードに移動",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "next");
                }, 10);
              }
            },
            {
              text: "前のレコードに移動",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "prev");
                }, 10);
              }
            },
            {
              text: "現在レコードの始端に移動",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "to-start");
                }, 10);
              }
            },
            {
              text: "現在レコードの終端に移動",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "to-end");
                }, 10);
              }
            },
            {
              text: "現在レコードを延長",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "extend");
                }, 10);
              }
            },
            {
              text: "現在レコードを短縮",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "shrink");
                }, 10);
              }
            },
            {
              text: "レコード分割 (フレーム毎)",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "split-by-frames");
                }, 10);
              }
            },
            {
              text: "レコード分割 (文字毎)",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-record", "split-by-chars");
                }, 10);
              }
            },
            {
              text: "レコード分割 (区切り文字毎: /)",
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
          text: "エクスポート",
          show: false,
          icon: "mdi-download",
          items: [
            {
              text: "TEXTGRID 形式で保存",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "TEXTGRID/TEXTGRID");
                }, 10);
              }
            },
            {
              text: "JSON 形式で保存",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "TEXTGRID/JSON");
                }, 10);
              }
            },
            {
              text: "XLSX 形式で保存",
              icon: "",
              click: () => {
                setTimeout(function() {
                  vm.$emit("click-download", "TEXTGRID/XLSX");
                }, 10);
              }
            }
          ]
        },
        {
          subheader: "フレーム転記",
          divider: true
        },
        {
          text: "画像転記画面を表示",
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
