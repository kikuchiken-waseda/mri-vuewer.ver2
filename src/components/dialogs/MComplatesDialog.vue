<template>
  <m-card-dialog
    persistent
    title="Complate Dict Upload Dialog"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <template v-slot:toolbar-actions>
      <v-btn icon @click="close" color="white">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-form>
          <m-completes-file-input />
        </v-form>
      </v-card-text>
      <v-list>
        <v-list-group v-for="(items, key) in complates" :key="key">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="key" />
            </v-list-item-content>
          </template>
          <v-list-item v-for="item in items" :key="item">
            <v-list-item-content>
              <v-list-item-title v-text="item" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
  </m-card-dialog>
</template>
<script>
import MCardDialog from "@/components/base/dialog/MCardDialog";
import MCompletesFileInput from "@/components/form/MCompletesFileInput.vue";
export default {
  name: "m-complates-dialog",
  components: { MCardDialog, MCompletesFileInput },
  props: {
    value: {
      type: Boolean,
      default: false
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
    },
    complates: function() {
      const data = this.$store.getters["current/complates/list"];
      return data;
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
