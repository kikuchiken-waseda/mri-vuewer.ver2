<template>
  <v-form ref="form">
    <div>
      <label>時系列転記連携</label>
      <v-autocomplete
        v-model="refTier"
        :items="refTiers"
        label="参照境界転記層"
      />
      <v-autocomplete
        v-model="targetTier"
        v-if="targetTiers.length"
        :items="targetTiers"
        label="対象イベント転記層"
      />
      <v-text-field v-model="text" v-if="targetTier" label="転記テキスト" />
    </div>

    <div class="my-5">
      <label>点群記述設定</label>
      <v-text-field
        label="点群ラベル"
        v-model="point.label"
        @click:append-outer="addPoint"
        append-outer-icon="mdi-plus"
      >
        <template v-slot:append>
          <m-color-menu icon v-model="point.color" />
        </template>
      </v-text-field>

      <v-list>
        <v-list-item v-for="(p, i) in points" :key="p.label">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon :color="p.color">mdi-palette</v-icon>
              {{ p.label }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action
            @click="$store.commit('current/frameConf/upPoint', i)"
          >
            <v-btn icon><v-icon>mdi-chevron-up</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action
            @click="$store.commit('current/frameConf/downPoint', i)"
          >
            <v-btn icon><v-icon>mdi-chevron-down</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action @click="deletePoint(i)">
            <v-btn icon><v-icon color="error">mdi-delete</v-icon> </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>

    <div class="my-5">
      <label>矩形記述設定</label>
      <v-text-field
        v-model="rect.label"
        label="矩形ラベル"
        @click:append-outer="addRect"
        append-outer-icon="mdi-plus"
      >
        <template v-slot:append>
          <m-color-menu icon v-model="rect.color" />
        </template>
      </v-text-field>
      <v-list>
        <v-list-item v-for="(r, i) in rects" :key="r.label">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon :color="r.color">mdi-palette</v-icon>
              {{ r.label }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action
            @click="$store.commit('current/frameConf/upRect', i)"
          >
            <v-btn icon><v-icon>mdi-chevron-up</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action
            @click="$store.commit('current/frameConf/downRect', i)"
          >
            <v-btn icon><v-icon>mdi-chevron-down</v-icon></v-btn>
          </v-list-item-action>

          <v-list-item-action @click="deleteRect(i)">
            <v-btn icon><v-icon color="error">mdi-delete</v-icon> </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
  </v-form>
</template>
<script>
import MColorMenu from "@/components/menus/MColorMenu";
const color = "#F44336";
export default {
  name: "m-frame-edit-conf-form",
  components: { MColorMenu },
  data: () => ({
    point: {
      label: "",
      color: color
    },
    rect: {
      label: "",
      color: color
    }
  }),
  computed: {
    refTier: {
      get() {
        return this.$store.state.current.frameConf.refTier;
      },
      set(key) {
        this.$store.commit("current/frameConf/refTier", key);
      }
    },
    targetTier: {
      get() {
        return this.$store.state.current.frameConf.targetTier;
      },
      set(key) {
        this.$store.commit("current/frameConf/targetTier", key);
      }
    },
    text: {
      get() {
        return this.$store.state.current.frameConf.text;
      },
      set(str) {
        this.$store.commit("current/frameConf/text", str);
      }
    },
    points: function() {
      return this.$store.state.current.frameConf.points;
    },
    rects: function() {
      return this.$store.state.current.frameConf.rects;
    },
    textgrid: function() {
      return this.$store.state.current.textgrid;
    },
    refTiers: function() {
      const choices = [null];
      const tiers = Object.keys(this.textgrid).filter(
        key => this.textgrid[key].type == "interval"
      );
      return choices.concat(tiers);
    },
    targetTiers: function() {
      const choices = [null];
      const tiers = Object.keys(this.textgrid).filter(
        key => this.textgrid[key].type == "point"
      );
      return choices.concat(tiers);
    }
  },
  methods: {
    addPoint() {
      if (this.points.findIndex(p => p.label == this.point.label) == -1) {
        if (this.point.label) {
          const point = JSON.parse(JSON.stringify(this.point));
          this.$store.commit("current/frameConf/pushPoint", point);
          this.point.label = "";
          this.point.color = color;
        }
      }
    },
    deletePoint(idx) {
      this.$store.commit("current/frameConf/deletePoint", idx);
    },
    addRect() {
      if (this.rects.findIndex(r => r.label == this.rect.label) == -1) {
        if (this.rect.label) {
          const rect = JSON.parse(JSON.stringify(this.rect));
          this.$store.commit("current/frameConf/pushRect", rect);
          this.rect.label = "";
          this.rect.color = color;
        }
      }
    },
    deleteRect(idx) {
      this.$store.commit("current/frameConf/deleteRect", idx);
    }
  }
};
</script>
<style scoped></style>
