<template>
  <v-container class="pa-0 transparent fill-height" fluid>
    <v-col class="pa-0">
      <v-card flat tile>
        <v-row dense v-resize="onResize">
          <v-col ref="videoArray" cols="videoCols" dense class="pa-0">
            <slot name="video"></slot>
          </v-col>
          <v-col
            :cols="textgridCols"
            class="pa-0"
            v-if="$vuetify.breakpoint.smAndUp"
          >
            <v-card
              :style="`max-height: ${maxHeight}px`"
              tile
              flat
              class="overflow-y-auto"
            >
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
    wsMaxHeight: 0,
    videoCols: 6
  }),
  computed: {
    textgridCols: function() {
      return 12 - this.videoCols;
    }
  },
  watch: {
    "$store.state.current.wavesurfer": function(val) {
      if (val) {
        if (this.maxHeight == 0) {
          this.$nextTick(() => {
            this.onResize();
          });
        }
      }
    }
  },
  methods: {
    onResize() {
      if (this.$refs.videoArray) {
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
    }
  }
};
</script>

<style scoped></style>
