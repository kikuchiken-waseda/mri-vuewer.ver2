<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on, attrs }">
      <div>
        <v-btn
          v-if="icon == false"
          :text="text"
          :color="picker"
          dark
          v-bind="attrs"
          v-on="on"
        >
          color
          <v-icon>mdi-palette</v-icon>
        </v-btn>
        <v-btn
          v-else
          dark
          icon
          :color="picker"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-palette</v-icon>
        </v-btn>
      </div>
    </template>
    <v-color-picker v-model="picker" flat show-swatches />
  </v-menu>
</template>
<script>
export default {
  name: "m-color-menu",
  props: {
    value: {
      type: String
    },
    text: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    picker: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style scoped></style>
