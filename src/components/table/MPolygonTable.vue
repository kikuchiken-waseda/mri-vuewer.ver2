<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:item.label="props">
      <v-edit-dialog
        :return-value.sync="props.item.polygonLabel"
        @close="close(props.item)"
      >
        {{ props.item.polygonLabel }}
        <template v-slot:input>
          <v-text-field
            v-model="props.item.polygonLabel"
            :rules="[max25chars]"
            label="Edit"
            single-line
            counter
          />
        </template>
      </v-edit-dialog>
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
        v-model="props.item.polygonColor"
        @input="close(props.item)"
      />
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        dark
        x-small
        color="error"
        @close="delete props.item.id"
        @click="
          $store.dispatch('current/frame/deletePolygon', {
            polygon_id: item.polygonId
          })
        "
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import MColorMenu from "@/components/menus/MColorMenu";
export default {
  name: "m-polygon-table",
  components: { MColorMenu },
  computed: {
    headers: function() {
      const headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.table.frame.label"),
          value: "label"
        }
      ];
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
    polygons: function() {
      return this.$store.state.current.frame.polygons;
    },
    items: function() {
      const items = this.polygons
        .filter(x => x.points)
        .map(x =>
          x.points.map(point => ({
            ...point,
            polygonId: x.id,
            polygonLabel: x.label,
            polygonColor: x.color,
            frameId: x.frameId
          }))
        )
        .flat();
      return items;
    }
  },
  data: () => ({
    max25chars: v => v.length <= 25 || "Input too long!",
    pagination: {}
  }),
  methods: {
    delete(item) {
      this.$store.dispatch("current/frame/deletePolygon", {
        polygon_id: item.id
      });
    },
    close(item) {
      const oldPolygon = this.polygons.find(
        x => x.id === item.polygonId
      );
      if (oldPolygon) {
        this.$store.dispatch("current/frame/updatePolygon", {
          ...oldPolygon,
          label: item.polygonLabel,
          color: item.polygonColor
        });
      }
    }
  }
};
</script>
