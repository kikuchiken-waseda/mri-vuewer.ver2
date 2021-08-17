<template>
  <v-container class="pa-0 transparent fill-height" fluid>
    <v-col class="pa-0">
      <v-card flat tile>
        <v-row dense v-resize="onResize">
          <v-col ref="videoArray" :cols="$videoCols" dense class="pa-0">
            <slot name="video"></slot>
          </v-col>
          <v-col :cols="$videoCols" dense class="pa-0 pl-2">
            <v-card v-if="!$mini" tile flat class="overflow-y-auto">
              <slot name="table"></slot>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <v-card
        :style="`max-height: ${wsMaxHeight}px`"
        class="d-flex mt-3 overflow-y-auto overflow-x-hidden"
        flat
        tile
      >
        <v-row>
          <v-col class="py-0 pr-0">
            <slot></slot>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <slot name="bottom"></slot>
  </v-container>
</template>
<script>
export default {
  name: "WVuewerLayout",
  data: () => ({
    maxHeight: 0,
    wsMaxHeight: 0
  }),
  computed: {
    $videoCols: {
      get: function() {
        return this.$store.state.current.layout.videoCols;
      },
      set: function(val) {
        this.$store.dispatch("current/layout/videoCols", val);
      }
    },
    $mini: function() {
      return this.$store.state.current.layout.mini;
    },
    arrayHeight: function() {
      return this.$refs.videoArray.clientHeight;
    }
  },
  watch: {
    "$refs.videoArray.clientHeight": function() {
      console.log("clientHeight");
    },
    "$vuetify.breakpoint.mdAndUp": function(val) {
      this.$videoCols = val == false ? 12 : 6;
    },
    "$store.state.current.wavesurfer": function(val) {
      if (val) {
        if (this.maxHeight == 0) {
          this.onResize();
        }
      }
    },
    $mini: function(val, old) {
      // 動画サイズが決定される時刻が不明なので
      // 一定時刻処理を回してみる形に実装
      if (old == false && val == true) {
        const i = 10;
        const vm = this;
        setInterval(vm.onResize, 1000);
        setTimeout(function() {
          clearInterval(vm.onResize);
        }, i * 1000);
      }
    }
  },
  methods: {
    onResize() {
      this.$nextTick(() => {
        if (this.$refs.videoArray) {
          // 高さ設定
          const children = this.$refs.videoArray.children;
          if (children) {
            let height = 0;
            for (const child of children) {
              if (child.clientHeight) {
                height = height + child.clientHeight;
              }
            }
            this.maxHeight = Math.round(height);
            this.wsMaxHeight = Math.round(window.innerHeight - height - 128);
            this.$emit("resize", this.maxHeight);
          }
        }
      });
    }
  },
  mounted: function() {
    this.$videoCols = this.$vuetify.breakpoint.mdAndUp == false ? 12 : 6;
  },
  beforeDestroy: function() {
    this.$store.dispatch("current/layout/init");
  }
};
</script>

<style scoped></style>
