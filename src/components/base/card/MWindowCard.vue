<template>
  <v-expand-transition>
    <v-card
      ref="window"
      v-show="!isCloseing"
      :tile="isMaximize ? true : tile"
      :style="style"
      :elevation="isDraging ? 10 : 1"
      :max-width="maxWidth"
      :min-height="`${isMaximize ? maximizedHeight : '0px'}`"
      :min-width="`${isMaximize ? maximizedWidth : '0px'}`"
    >
      <v-system-bar
        @mousedown="onMouseDown"
        :color="`${color} darken-${isDraging ? '4' : '2'}`"
        dark
      >
        <v-spacer></v-spacer>
        <div v-if="isMaximize">
          <v-icon @click.prevent="maximize">
            mdi-window-minimize
          </v-icon>
          <v-icon @click.prevent="close">mdi-close</v-icon>
        </div>
        <div v-else>
          <v-icon @click.prevent="close">
            mdi-window-minimize
          </v-icon>
          <v-icon @click.prevent="maximize">
            mdi-window-maximize
          </v-icon>
        </div>
      </v-system-bar>
      <v-toolbar dense :color="color" dark>
        <slot name="toolbar">
          <v-toolbar-title v-if="title">
            {{ title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <slot name="toolbar-actions"></slot>
        </slot>
      </v-toolbar>
      <v-container fluid class="pa-0">
        <slot></slot>
      </v-container>
    </v-card>
  </v-expand-transition>
</template>
<script>
export default {
  name: "m-window-card",
  props: {
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "primary"
    },
    icon: {
      type: String,
      default: ""
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    maxWidth: {
      type: String,
      default: "100%"
    },
    maximizedWidth: {
      type: String,
      default: "100%"
    },
    maximizedHeight: {
      type: String,
      default: "100%"
    },
    tile: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    hide: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    zIndex: 1,
    id: null,
    isDraged: false,
    isDraging: false,
    isCloseing: true,
    isMaximize: false,
    position: {
      x: 0,
      y: 0
    },
    firstPosition: {
      x: 0,
      y: 0
    },
    offset: {
      x: null,
      y: null,
      width: null,
      height: null,
      top: null,
      left: null
    }
  }),
  computed: {
    style: function() {
      const style = {
        position: "absolute"
      };
      if (this.right) {
        style.right = `${this.position.x}px`;
      } else {
        style.left = `${this.position.x}px`;
      }
      if (this.bottom) {
        style.bottom = `${this.position.y}px`;
      } else {
        style.top = `${this.position.y}px`;
      }
      style["z-index"] = this.zIndex;
      return style;
    }
  },
  methods: {
    setZIndex(val) {
      this.zIndex = val;
    },
    close: function() {
      this.isMaximize = false;
      this.isCloseing = true;
      this.$store.commit("wcards/closing", this);
    },
    open: function() {
      this.position.x = this.firstPosition.x;
      this.position.y = this.firstPosition.y;
      this.isMaximize = false;
      this.isCloseing = false;
      this.$store.commit("wcards/open", this);
    },
    maximize: function() {
      if (this.isMaximize) {
        this.isMaximize = false;
      } else {
        this.position.x = 0;
        this.position.y = 0;
        this.isMaximize = true;
      }
    },
    setOffset: function(e) {
      const position = this.$refs.window.$el.getBoundingClientRect();
      if (this.offset.x == null) this.offset.x = position.x - e.clientX;
      if (this.offset.y == null) this.offset.y = position.y - e.clientY;
      if (this.offset.top == null) this.offset.top = position.y;
      if (this.offset.left == null) this.offset.left = position.x;
      if (this.offset.width == null) this.offset.width = position.width;
      if (this.offset.height == null) this.offset.height = position.height;
    },
    setPosition: function(e) {
      if (this.isMaximize == false) {
        const x =
          e.pageX + this.offset.x - this.offset.left + this.firstPosition.x;
        const y =
          e.pageY + this.offset.y - this.offset.top + this.firstPosition.y;
        this.position.x = this.right ? -x : x;
        this.position.y = this.bottom ? -y : y;
      }
    },
    onMouseDown: function(e) {
      e.preventDefault();
      this.setOffset(e);
      document.body.addEventListener("mousemove", this.onMouseMove, false);
      document.body.addEventListener("mouseleave", this.onMouseUp, false);
      document.body.addEventListener("mouseup", this.onMouseUp, false);
      this.isDraging = true;
      this.isDraged = false;
    },
    onMouseUp: function(e) {
      e.preventDefault();
      document.body.removeEventListener("mousemove", this.onMouseMove, false);
      document.body.removeEventListener("mouseleave", this.onMouseUp, false);
      document.body.removeEventListener("mouseup", this.onMouseUp, false);
      this.isDraging = false;
      this.isDraged = true;
      this.$store.dispatch("wcards/setZIndex", { id: this.id, zIndex: 3 });
    },
    onMouseMove: function(e) {
      if (this.isDraging == true) {
        e.preventDefault();
        this.setPosition(e);
      }
    }
  },
  watch: {
    hide: function(val, old) {
      if (val != old) {
        if (val) {
          this.close();
        } else {
          this.open();
        }
      }
    }
  },
  mounted: function() {
    this.position.x = this.x;
    this.position.y = this.y;
    this.firstPosition.x = this.position.x;
    this.firstPosition.y = this.position.y;
    this.id = this.$store.state.wcards.cards.length;
    this.$store.commit("wcards/setCard", this);
    if (this.hide) {
      this.close();
    } else {
      this.open();
    }
  }
};
</script>
<style scoped></style>
