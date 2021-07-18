import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";
import ja from "@/locale/ja.js";
import en from "@/locale/en.js";

Vue.use(Vuetify);
export const options = {
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  lang: {
    locales: { ja, en },
    current: "ja"
  }
};
export default new Vuetify(options);
