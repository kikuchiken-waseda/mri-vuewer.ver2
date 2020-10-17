<template>
  <v-menu v-model="menu" absolute offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-card
        v-bind="attrs"
        @click.right.prevent="on.click"
        @keydown="on.keydown"
      >
        <slot></slot>
      </v-card>
    </template>
    <slot name="toolbar">
      <v-toolbar v-if="title" dense :color="color" dark>
        <v-toolbar-title>{{ $vuetify.lang.t(title) }}</v-toolbar-title>
      </v-toolbar>
    </slot>
    <slot name="menu">
      <v-card
        tile
        flat
        class="mx-auto overflow-y-auto"
        :min-width="minWidth"
        max-height="600"
      >
        <input
          ref="input"
          :accept="accept"
          @change="onChange"
          type="file"
          style="display:none"
        />
        <slot name="menu-contents">
          <v-list
            dense
            subheader
            class="overflow-y-auto"
            :max-height="maxHeight"
          >
            <div v-for="(item, key) in items" :key="key">
              <v-subheader
                v-if="item.subheader"
                class="grey--text text--darken-3"
              >
                {{ $vuetify.lang.t(item.subheader) }}
              </v-subheader>
              <v-divider v-else />

              <v-list-group
                v-if="item.items"
                v-model="item.show"
                :prepend-icon="item.icon"
                @click.stop.prevent
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $vuetify.lang.t(item.text) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="(x, key) in item.items"
                  :key="key"
                  @click="x.click"
                >
                  <v-list-item-icon>
                    <v-icon></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon v-if="x.icon"> {{ x.icon }} </v-icon>
                      {{ $vuetify.lang.t(x.text) }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="x.kbd">
                    <v-spacer />
                    <v-list-item-action-text v-text="x.kbd" />
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>

              <v-list-item v-else-if="item.text" @click="item.click">
                <v-list-item-icon>
                  <v-icon> {{ item.icon }} </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $vuetify.lang.t(item.text) }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="item.kbd">
                  <v-list-item-action-text v-text="item.kbd" />
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-list>
        </slot>
      </v-card>
    </slot>
  </v-menu>
</template>
<script>
export default {
  name: "MContextMenu",
  props: {
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "primary"
    },
    items: {
      type: Array,
      default: () => []
    },
    accept: {
      type: String,
      default: ""
    },
    maxHeight: {
      type: String,
      default: "450"
    },
    minWidth: {
      type: String,
      default: "400"
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    open() {
      this.$refs.input.click();
    },
    onChange() {
      const file = this.$refs.input.files;
      this.$emit("change", file);
    }
  }
};
</script>

<style scoped></style>
