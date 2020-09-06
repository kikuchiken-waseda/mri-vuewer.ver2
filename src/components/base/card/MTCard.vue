<template>
  <v-card class="mx-auto" :color="color" :flat="flat" :tile="tile">
    <v-system-bar
      v-if="accordion"
      :color="`${titleColor} darken-2`"
      window
      dark
    >
      <v-spacer></v-spacer>
      <v-icon v-if="isCloseing" @click.prevent="open">
        mdi-window-maximize
      </v-icon>
      <v-icon v-else @click.prevent="close">
        mdi-window-minimize
      </v-icon>
    </v-system-bar>
    <v-toolbar :dense="dense" :color="titleColor" dark v-if="title">
      <v-icon class="mr-2" :color="prependIconColor" v-if="prependIcon">
        {{ prependIcon }}
      </v-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="toolbar-actions">
        <v-btn
          icon
          @click="item.action"
          v-for="(item, i) in toolbarActions"
          :key="i"
        >
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </slot>
    </v-toolbar>
    <v-expand-transition>
      <slot v-if="!isCloseing"></slot>
    </v-expand-transition>
  </v-card>
</template>
<script>
export default {
  name: "MTCard",
  data: () => ({
    isCloseing: false
  }),
  methods: {
    close: function() {
      this.isCloseing = true;
    },
    open: function() {
      this.isCloseing = false;
    }
  },
  props: {
    title: {
      type: String
    },
    tile: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "white"
    },
    titleColor: {
      type: String,
      default: "primary"
    },
    prependIconColor: {
      type: String,
      default: ""
    },
    toolbarActions: {
      type: Array,
      validator: function(value) {
        if (value.length == 0) return true;
        const check = value.map(x => {
          return "icon" in x && "action" in x;
        });
        return check.every(val => val);
      },
      default: () => []
    }
  }
};
</script>

<style scoped></style>
