<template>
  <v-data-table :headers="headers" :items="rects">
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
    <template v-slot:item.width="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ (item.width / cw) * ow }}
      </span>
    </template>
    <template v-slot:item.height="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ (item.height / ch) * oh }}
      </span>
    </template>
    <template v-slot:item.rotation="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.rotation }}
      </span>
    </template>
    <template v-slot:item.scaleX="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.scaleX }}
      </span>
    </template>
    <template v-slot:item.scaleY="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 30px;">
        {{ item.scaleY }}
      </span>
    </template>

    <template v-slot:item.color="props">
      <v-edit-dialog
        ref="colorEditDialog"
        :return-value.sync="props.item.color"
        @close="close(props.item)"
      >
        {{ props.item.color }}
        <template v-slot:input>
          <v-color-picker
            label="Edit"
            v-model="props.item.color"
            show-swatches
          />
          <v-text-field v-model="props.item.color" label="Edit" single-line />
        </template>
      </v-edit-dialog>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: "m-rect-table",
  props: {
    rects: {
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
      { text: "width", value: "width" },
      { text: "height", value: "height" },
      { text: "rotation", value: "rotation" },
      { text: "scale (x)", value: "scaleX" },
      { text: "scale (y)", value: "scaleY" },
      { text: "color", value: "color" }
    ]
  }),
  methods: {
    close(item) {
      this.$emit("update-rect", item);
    }
  }
};
</script>

<style scoped></style>
