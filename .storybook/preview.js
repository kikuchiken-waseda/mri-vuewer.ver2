import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import store from "@/store";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  lang: {
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
          <v-container fluid>
            <wrapped />
          </v-container>
        </v-app>
      `
    });
  }
];
