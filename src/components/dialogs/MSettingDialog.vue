<template>
  <m-card-dialog
    :fullscreen="$store.state.current.layout.mini"
    title="Setting"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <v-card tile>
      <v-card-text>
        <m-setting-from />
      </v-card-text>
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MSettingFrom from "@/components/form/MSettingForm.vue";
export default {
  name: "m-setting-dialog",
  components: {
    MCardDialog,
    MSettingFrom
  },
  props: {
    value: {
      type: Boolean
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
    }
  }
};
</script>
<style scoped></style>
