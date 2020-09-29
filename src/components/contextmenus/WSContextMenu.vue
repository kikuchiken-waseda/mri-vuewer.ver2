<template>
  <m-context-menu>
    <slot> </slot>
    <template v-slot:menus>
      <v-card class="mx-auto" max-width="400">
        <v-toolbar dense color="primary" dark>
          <v-toolbar-title>WAVE-SERFER-MENU</v-toolbar-title>
        </v-toolbar>
        <v-img :src="image" />
        <v-divider></v-divider>
        <v-virtual-scroll :items="items" :item-height="50" height="300">
          <template v-slot="{ item }">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card>
    </template>
  </m-context-menu>
</template>
<script>
import MContextMenu from "@/components/base/MContextMenu";
import FrameMixin from "@/mixins/MFrameMixin.js";
export default {
  name: "WSContextMenu",
  mixins: [FrameMixin],
  components: {
    MContextMenu
  },
  computed: {
    items: function() {
      return [
        { text: "再生/停止", icon: "mdi-play-pause" },
        { text: "1フレーム前に移動", icon: "mdi-skip-backward" },
        { text: "1フレーム後に移動", icon: "mdi-skip-forward" },
        { text: "画像転記画面を表示", icon: "mdi-image-edit" },
        { text: "拡大", icon: "mdi-magnify-plus-cursor" },
        { text: "縮小", icon: "mdi-magnify-minus-cursor" },
        {
          text: "転記ファイルの読み込み (TextGrid)",
          icon: "mdi-application-import"
        },
        {
          text: "転記ファイルの読み込み (JSON)",
          icon: "mdi-application-import"
        },
        { text: "インターバル層を追加", icon: "mdi-playlist-plus" },
        { text: "ポイント層を追加", icon: "mdi-playlist-plus" },
        { text: "転記層を削除", icon: "mdi-playlist-minus" },
        { text: "転記層を変更", icon: "mdi-playlist-edit" },
        {
          text: "転記ファイルの掃き出し (TextGrid)",
          icon: "mdi-application-export"
        },
        {
          text: "転記ファイルを掃き出し (JSON)",
          icon: "mdi-application-export"
        }
      ];
    }
  }
};
</script>

<style scoped></style>
