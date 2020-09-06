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
    <template v-slot:item.x="props">
      {{ Math.round((props.item.x / cw) * ow) }}
    </template>
    <template v-slot:item.y="props">
      {{ Math.round((props.item.y / ch) * oh) }}
    </template>
    <template v-slot:item.color="props">
      <v-edit-dialog
        ref="colorEditDialog"
        :return-value.sync="props.item.color"
        @close="close(props.item)"
      >
        {{ props.item.color }}
        <template v-slot:input>
          <v-color-picker label="Edit" v-model="props.item.color" />
          <v-text-field v-model="props.item.color" label="Edit" single-line />
        </template>
      </v-edit-dialog>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: "m-point-table",
  props: {
    points: {
      type: Array
    },
    originSize: {
      type: Object
    },
    canvasSize: {
      type: Object
    }
  },
  computed: {
    ow: function() {
      return this.originSize.width ? this.originSize.width : 0;
    },
    oh: function() {
      return this.originSize.height ? this.originSize.height : 0;
    },
    cw: function() {
      return this.canvasSize.width ? this.canvasSize.width : 0;
    },
    ch: function() {
      return this.canvasSize.height ? this.canvasSize.width : 0;
    }
  },
  data: () => ({
    max25chars: v => v.length <= 25 || "Input too long!",
    pagination: {},
    headers: [
      { text: "label", value: "label" },
      { text: "x", value: "x" },
      { text: "y", value: "y" },
      { text: "color", value: "color" }
    ]
  }),
  methods: {
    close(item) {
      this.$emit("update-point", item);
    }
  }
};
</script>

<style scoped></style>
