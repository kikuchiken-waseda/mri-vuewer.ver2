<template>
  <v-dialog v-model="dialog" hide-overlay persistent :width="width">
    <m-loading-card :color="color" :progress-color="progressColor">
      <slot></slot>
    </m-loading-card>
  </v-dialog>
</template>
<script>
import MLoadingCard from "@/components/base/card/MLoadingCard";
export default {
  name: "MLoadingDialog",
  components: {
    MLoadingCard
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "primary"
    },
    progressColor: {
      type: String,
      default: "white"
    },
    width: {
      type: Number,
      default: 300
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
