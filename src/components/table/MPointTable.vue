<template>
  <v-data-table :headers="headers" :items="points">
    <template v-slot:item.label="props">
      <v-edit-dialog
        :return-value.sync="props.item.label"
        @close="close(props.item)"
      >
        {{ props.item.label }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.label"
            :rules="[max25chars]"
            label="Edit"
            single-line
            counter
          />
        </template>
      </v-edit-dialog>
    </template>

    <template v-if="showFrame" v-slot:item.time="props">
      {{ $vuewer.math.round(props.item.frame.time, 3) }}
    </template>

    <template v-slot:item.x="props">
      {{ Math.round(props.item.x) }}
    </template>
    <template v-slot:item.y="props">
      {{ Math.round(props.item.y) }}
    </template>
    <template v-slot:item.color="props">
      <m-color-menu
        icon
        v-model="props.item.color"
        @input="close(props.item)"
      />
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        dark
        x-small
        color="error"
        @click="$store.dispatch('current/frame/deletePoint', item.id)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import MColorMenu from "@/components/menus/MColorMenu";
export default {
  name: "m-point-table",
  components: { MColorMenu },
  props: {
    showFrame: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    headers: function() {
      const headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.label"),
          value: "label"
        }
      ];
      if (this.showFrame) {
        headers.push({
          text: this.$vuetify.lang.t("$vuetify.table.frame.frame"),
          value: "frame.idx"
        });
      }
      headers.push({
        text: this.$vuetify.lang.t("$vuetify.table.frame.x"),
        value: "x"
      });
      headers.push({
        text: this.$vuetify.lang.t("$vuetify.table.frame.y"),
        value: "y"
      });
      headers.push({
        text: this.$vuetify.lang.t("$vuetify.table.frame.color"),
        value: "color"
      });
      headers.push({
        text: this.$vuetify.lang.t("$vuetify.actions"),
        value: "actions",
        width: "150px",
        sortable: false,
        align: "end"
      });
      return headers;
    },
    points: function() {
      return this.$store.state.current.frame.points;
    }
  },
  data: () => ({
    max25chars: v => v.length <= 25 || "Input too long!",
    pagination: {}
  }),
  methods: {
    close(item) {
      this.$store.dispatch("current/frame/updatePoint", {
        id: item.id,
        label: item.label,
        color: item.color
      });

      // this.$emit("update-point", item);
    }
  }
};
</script>

<style scoped></style>
