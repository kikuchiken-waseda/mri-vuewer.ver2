<template>
  <m-window-card
    ref="window"
    :x="0"
    :y="0"
    :hide="hide"
    :title="title"
    max-width="600px"
  >
    <v-card tile flat>
      <v-row v-if="src !== null && src2 !== null">
        <v-col cols="6" class="py-0 pr-0">
          <v-img :src="src" />
        </v-col>
        <v-col cols="6" class="py-0 pl-0">
          <v-img :src="src2" />
        </v-col>
      </v-row>
      <m-loading text="$vuetify.loading" v-else />
    </v-card>
  </m-window-card>
</template>
<script>
import MWindowCard from "@/components/base/card/MWindowCard.vue";
import MLoading from "@/components/MLoading";
export default {
  name: "m-diff-card",
  components: {
    MWindowCard,
    MLoading
  },
  data: () => ({
    src: null,
    src2: null
  }),
  props: {
    hide: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    open: function() {
      const elm = this.$refs.window;
      if (elm) elm.open();
    },
    close: function() {
      const elm = this.$refs.window;
      if (elm) elm.close();
    },
    framediff: function() {
      if (this.current && this.prev) {
        this.$vuewer.image
          .frameDiff(this.prev, this.current, this.originSize)
          .then(res => {
            this.src = res;
          })
          .catch(error => {
            this.src = null;
            this.$vuewer.snackbar.error(error);
          });
      } else {
        this.src = null;
      }
    },
    framediff2: function() {
      if (this.current && this.next) {
        this.$vuewer.image
          .frameDiff(this.current, this.next, this.originSize)
          .then(res => {
            this.src2 = res;
          })
          .catch(error => {
            this.src2 = null;
            this.$vuewer.snackbar.error(error);
          });
      } else {
        this.src2 = null;
      }
    }
  },
  watch: {
    isChange: function(val, old) {
      if (val != old) {
        if (val == false) {
          this.src = null;
          this.src2 = null;
          this.framediff();
          this.framediff2();
        }
      }
    }
  },
  computed: {
    title: () => {
      return "$vuetify.contexts.windows.framediff";
    },
    isChange: function() {
      return this.$store.state.current.frame.isChange;
    },
    originSize: function() {
      return this.$store.state.current.originSize;
    },
    current: function() {
      return this.$store.state.current.frame.src;
    },
    next: function() {
      return this.$store.state.current.frame.next;
    },
    prev: function() {
      return this.$store.state.current.frame.prev;
    }
  }
};
</script>

<style scoped></style>
