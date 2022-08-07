<template>
  <m-card
    :icon="icon"
    ref="card"
    v-resize="onResize"
    class="v-card--material-stats"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:after-heading>
      <div class="ml-auto text-right">
        <div class="body-3 font-weight-light" v-text="title" />
        <h3 class="display-2 font-weight-light text--primary">
          {{ value }} <small>{{ smallValue }}</small>
        </h3>
      </div>
    </template>
    <v-col cols="12" class="px-0">
      <v-divider />
    </v-col>
    <v-icon :color="subIconColor">
      {{ subIcon }}
    </v-icon>
    <span
      ref="subText"
      class="caption font-weight-light mt-1 d-inline-block text-truncate"
      :style="subTextStyle"
      v-text="subText"
    />
    <v-spacer />
    <v-btn
      icon
      small
      v-for="(action, key) in actions"
      :key="key"
      @click="action.function"
    >
      <v-icon>{{ action.icon }}</v-icon>
    </v-btn>
  </m-card>
</template>

<script>
import Card from "./Card";
import MCard from "./MCard.vue";

export default {
  name: "MHCard",
  inheritAttrs: false,
  components: {
    MCard
  },
  props: {
    ...Card.props,
    icon: {
      type: String,
      required: true
    },
    subIcon: {
      type: String,
      default: undefined
    },
    subIconColor: {
      type: String,
      default: undefined
    },
    subText: {
      type: String,
      default: undefined
    },
    title: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
    smallValue: {
      type: String,
      default: undefined
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    subTextMaxWidth: 150
  }),
  computed: {
    subTextStyle: function() {
      return `max-width: ${this.subTextMaxWidth}px;`;
    }
  },
  methods: {
    onResize() {
      this.$nextTick(() => {
        const iconSize = 50 * (this.actions.length + 1);
        if (this.$refs.card) {
          if (this.$refs.card.$el) {
            const subTextMaxWidth =
              this.$refs.card.$el.clientWidth - iconSize;
            this.subTextMaxWidth = subTextMaxWidth;
          }
        }
      });
    }
  },
  mounted: function() {
    this.onResize();
  }
};
</script>

<style lang="sass">
.v-card--material-stats
  display: flex
  flex-wrap: wrap
  position: relative

  > div:first-child
    justify-content: space-between

  .v-card
    border-radius: 4px
    flex: 0 1 auto

  .v-card__text
    display: inline-block
    flex: 1 0 calc(100% - 120px)
    position: absolute
    top: 0
    right: 0
    width: 100%

  .v-card__actions
    flex: 1 0 100%
</style>
