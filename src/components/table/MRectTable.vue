<template>
  <v-data-table item-key="id" :headers="headers" :items="rects">
    <template v-slot:item.label="{ item }">
      <v-edit-dialog
        :return-value.sync="item.label"
        @close="close(item)"
      >
        {{ item.label }}
        <template v-slot:input>
          <v-text-field
            v-model="item.label"
            :rules="[max25chars]"
            label="Edit"
            single-line
            counter
          />
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.x="{ item }">
      {{ Math.round(item.x) }}
    </template>
    <template v-slot:item.y="{ item }">
      {{ Math.round(item.y) }}
    </template>
    <template v-slot:item.width="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
      >
        {{
          item.scaleX
            ? Math.round(item.scaleX * item.width)
            : Math.round(item.width)
        }}
      </span>
    </template>
    <template v-slot:item.height="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
      >
        {{
          item.scaleY
            ? Math.round(item.scaleY * item.height)
            : Math.round(item.height)
        }}
      </span>
    </template>
    <template v-slot:item.rotation="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
      >
        {{ item.rotation || 0 }}
      </span>
    </template>
    <template v-slot:item.scaleX="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
      >
        {{ item.scaleX }}
      </span>
    </template>
    <template v-slot:item.scaleY="{ item }">
      <span
        class="d-inline-block text-truncate"
        style="max-width: 30px;"
      >
        {{ item.scaleY }}
      </span>
    </template>

    <template v-slot:item.color="{ item }">
      <m-color-menu icon v-model="item.color" @input="close(item)" />
    </template>
  </v-data-table>
</template>
<script>
import MColorMenu from "@/components/menus/MColorMenu";
export default {
  name: "m-rect-table",
  components: { MColorMenu },
  computed: {
    rects: function() {
      const rects = this.$store.state.current.frame.rects;
      return rects;
    },
    headers: function() {
      return [
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.label"),
          value: "label"
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.x"),
          value: "x"
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.y"),
          value: "y"
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.width"),
          value: "width"
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.height"),
          value: "height"
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.rotation"),
          value: "rotation"
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.color"),
          value: "color"
        }
      ];
    }
  },
  data: () => ({
    max25chars: v => v.length <= 25 || "Input too long!",
    pagination: {}
  }),
  methods: {
    close(item) {
      this.$emit("update-rect", item);
    }
  }
};
</script>

<style scoped></style>
