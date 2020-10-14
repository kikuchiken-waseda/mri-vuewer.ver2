<template>
  <v-autocomplete
    dense
    hide-no-data
    hide-details
    outlined
    solo
    ref="text"
    v-model="text"
    :disabled="disabled"
    :filter="autocomplete"
    :items="choices"
    item-text="name"
    item-value="val"
    @keydown.stop
    @keydown.enter="onEnter"
    @keydown.prevent.tab.exact
    @keydown.prevent.alt.tab="onNext"
    @keydown.ctrl.219="$emit('esc')"
    @keydown.27.prevent="$emit('esc')"
  >
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title v-text="data.item.name" />
        <v-list-item-subtitle v-text="data.item.rubi" />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: "m-record-text-field",
  props: {
    value: {
      validator: v => typeof v === "string" || v === null,
      required: true
    },
    complateKey: {
      validator: v => typeof v === "string" || v === null,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    text: {
      get() {
        return this.value;
      },
      set(value) {
        if (value) {
          this.$emit("input", value);
        } else {
          this.$emit("input", "");
        }
      }
    },
    choices: function() {
      const choices = [];
      const key = this.complateKey;

      const complates = this.$store.state.current.complates.complates;
      if (complates[key]) {
        choices.push(...complates[key]);
      }

      const textgrid = this.$store.state.current.textgrid;
      if (textgrid != null && key in textgrid) {
        const _words = [
          ...new Set(
            this.$store.state.current.textgrid[key].values
              .map(v => v.text)
              .filter(v => {
                const idx = choices.findIndex(c => c.val == v);
                return idx === -1;
              })
          )
        ];
        choices.push(
          ..._words.map(v => ({
            name: v,
            val: v,
            rubi: v ? this.$vuewer.text.toHebon(v) : ""
          }))
        );
      }
      return choices;
    }
  },
  methods: {
    autocomplete(item, input) {
      const rubi = item.rubi.toLowerCase();
      const val = item.val.toLowerCase();
      const query = input.toLowerCase();
      return rubi.startsWith(query) || val.startsWith(query);
    },
    setText: function() {
      const inputs = [
        ...this.$refs.text.$el.getElementsByTagName("input")
      ].filter(e => e.type == "text");
      const text = this.$vuewer.text.clean(inputs.map(e => e.value).join(""));
      this.text = text ? text : "";
    },
    onNext: function() {
      this.setText();
      this.$emit("next");
    },
    onEnter: function() {
      this.setText();
      this.$emit("enter");
    },
    blur: function() {
      this.$refs.text.blur();
    },
    focus: function() {
      this.$refs.text.focus();
    }
  }
};
</script>

<style scoped></style>
