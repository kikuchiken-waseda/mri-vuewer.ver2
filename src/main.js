import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import vuewer from "./plugins/vuewer";
import VueKonva from "vue-konva";

Vue.config.productionTip = false;
Vue.use(VueKonva);
Vue.use(vuewer);
new Vue({
  router,
  store,
  vuetify,
  vuewer,
  render: h => h(App)
}).$mount("#app");
