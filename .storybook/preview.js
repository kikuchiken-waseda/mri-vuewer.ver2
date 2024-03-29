import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import Vue from "vue";
import Vuetify from "vuetify";
import VueKonva from "vue-konva";

import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

import store from "@/store";
import ja from "@/locale/ja.js";
import en from "@/locale/en.js";
import vuewer from "../src/plugins/vuewer";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  lang: {
    locales: { ja, en },
    current: "ja"
  }
});
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewport: {
    viewports: {
      vDialog: {
        name: "vDialog",
        styles: {
          width: "700px",
          height: "660px"
        },
        type: "tablet"
      },
      ...INITIAL_VIEWPORTS
    }
  }
};

Vue.use(VueKonva);
Vue.use(vuewer);
export const decorators = [
  (story, context) => {
    const wrapped = story(context);
    return Vue.extend({
      store,
      vuetify,
      vuewer,
      components: { wrapped },
      props: {
        locale: {
          type: String,
          default: "ja"
        }
      },
      watch: {
        dark: {
          immediate: true,
          handler(val) {
            this.$vuetify.theme.dark = val;
          }
        }
      },
      template: `
        <v-app>
          <v-main>
            <wrapped />
          </v-main>
        </v-app>
      `
    });
  }
];
