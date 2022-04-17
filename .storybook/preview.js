import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import store from "@/store";
import ja from "@/locale/ja.js";
import en from "@/locale/en.js";

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
  actions: { argTypesRegex: "^on[A-Z].*" }
};

export const decorators = [
  (story, context) => {
    const wrapped = story(context);
    return Vue.extend({
      store,
      vuetify,
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
