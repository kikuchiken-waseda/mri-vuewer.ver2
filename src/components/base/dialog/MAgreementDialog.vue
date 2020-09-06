<template>
  <m-card-dialog
    ref="dialog"
    :dense="dense"
    :persistent="persistent"
    :toolbar-actions="toolbarActions"
    :max-width="maxWidth"
    :title="title"
    :title-color="titleColor"
    :prepend-icon="prependIcon"
    :prepend-icon-color="prependIconColor"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card-text class="mt-2">
      <slot></slot>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="close">
        Disagree
      </v-btn>
      <v-btn color="green darken-1" text @click="next">
        Agree
      </v-btn>
    </v-card-actions>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog.vue";
export default {
  name: "MAgreementDialog",
  components: {
    MCardDialog
  },
  props: {
    title: {
      type: String
    },
    nextAction: {
      type: Function
    },
    actionArgs: {
      default: null
    },
    dense: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: "mdi-alert-outline"
    },
    titleColor: {
      type: String,
      default: "warning"
    },
    prependIconColor: {
      type: String,
      default: "white"
    },
    toolbarActions: {
      type: Array,
      validator: function(value) {
        if (value.length == 0) return true;
        const check = value.map(x => {
          return "icon" in x && "function" in x;
        });
        return check.every(val => val);
      },
      default: () => []
    },
    persistent: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: "300px"
    }
  },
  methods: {
    close: function() {
      this.$refs.dialog.close();
    },
    next: function() {
      if (this.nextAction) {
        if (this.actionArgs) {
          this.nextAction(this.actionArgs);
        } else {
          this.nextAction();
        }
      }
      this.close();
    }
  }
};
</script>

<style scoped></style>
