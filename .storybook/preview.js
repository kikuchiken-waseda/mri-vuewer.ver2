import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);
const vuetify = new Vuetify({
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
