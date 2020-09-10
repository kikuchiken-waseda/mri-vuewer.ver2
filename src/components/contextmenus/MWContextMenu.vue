<template>
  <m-context-menu>
    <slot> </slot>
    <template v-slot:menus>
      <v-card ref="card" class="mx-auto" min-width="300">
        <v-toolbar dense color="primary" dark>
          <v-toolbar-title>WAVE-MENU</v-toolbar-title>
        </v-toolbar>
        <v-virtual-scroll :items="items" :item-height="50" height="300">
          <template v-slot="{ item }">
            <v-list-item v-if="item.text" @click="item.click">
              <v-list-item-icon>
                <v-icon color="primary">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="item.divider" />
          </template>
        </v-virtual-scroll>
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
          click: this.playPause,
          divider: true
        },
        {
          text: "進む",
          icon: "mdi-skip-backward",
          click: this.skipBackward
        },
        {
          text: "戻る",
          icon: "mdi-skip-forward",
          click: this.skipForward,
          divider: true
        },
        {
          text: "拡大",
          icon: "mdi-magnify-plus-cursor",
          click: this.incPxPerSec
        },
        {
          text: "縮小",
          icon: "mdi-magnify-minus-cursor",
          click: this.decPxPerSec,
          divider: true
        },
        {
          text: "画像転記画面を表示",
          icon: "mdi-selection-drag",
          click: () => {
            vm.$emit("click-image-edit");
          },
          divider: true
        },
        {
          text: "転記層を追加",
          icon: "mdi-plus",
          click: () => {
            vm.$emit("click-tier-add");
          }
        },
        {
          text: "転記層を変更",
          icon: "mdi-pencil",
          click: () => {
            vm.$emit("click-tier-edit");
          }
        },
        {
          text: "転記層を削除",
          icon: "mdi-delete",
          click: () => {
            vm.$emit("click-tier-delete");
          },
          divider: true
        },
        {
          text: "TEXTGRID 形式で保存",
          icon: "",
          click: () => {
            vm.$emit("click-download", "TEXTGRID/TEXTGRID");
          }
        },
        {
          text: "JSON 形式で保存",
          icon: "",
          click: () => {
            vm.$emit("click-download", "TEXTGRID/JSON");
          }
        },
        {
          text: "XLSX 形式で保存",
          icon: "",
          click: () => {
            vm.$emit("click-download", "TEXTGRID/XLSX");
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
