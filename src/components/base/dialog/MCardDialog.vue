<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullscreen"
    :hide-overlay="hideOverlay"
    :transition="transition"
    :persistent="persistent"
    :scrollable="scrollable"
    :max-width="maxWidth"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <m-t-card
      :title="title"
      :title-color="titleColor"
      :prependIcon="prependIcon"
      :prependIconColor="prependIconColor"
      :toolbar-actions="toolbarActions"
      :dense="dense"
    >
      <template v-slot:toolbar-actions>
        <slot name="toolbar-actions"> </slot>
      </template>
      <slot></slot>
    </m-t-card>
  </v-dialog>
</template>
<script>
import MTCard from "@/components/base/card/MTCard.vue";
export default {
  name: "MDialog",
  components: {
    MTCard
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    hideOverlay: {
      type: Boolean,
      default: function() {
        return this.fullscreen;
      }
    },
    transition: {
      type: String,
      default: function() {
        return this.fullscreen
          ? "dialog-bottom-transition"
          : "dialog-transition";
      }
    },
    dense: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: ""
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
      default: function() {
        const vm = this;
        const close = () => {
          vm.dialog = false;
        };
        return this.fullscreen ? [{ icon: "mdi-close", action: close }] : [];
      }
    },
    persistent: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: "600px"
    }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    close: function() {
      this.dialog = false;
    },
    open: function() {
      this.dialog = true;
    }
  }
};
</script>

<style scoped></style>
