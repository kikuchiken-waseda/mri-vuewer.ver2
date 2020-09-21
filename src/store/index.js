import Vue from "vue";
import Vuex from "vuex";

import wcards from "./wcards.js";
import snackbar from "./snackbar.js";
import search from "./search.js";
import logging from "./logging.js";
import loading from "./loading.js";

import setting from "./setting.js";
import current from "./current";
import files from "./files";
import metadata from "./metadata.js";
import hash from "./hash.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: "MRI Vuewer",
    appVersion: "2.0",
    author: "qh73xe",
    devYear: "2017-2020",
    github: "https://github.com/kikuchiken-waseda/mri-vuewer.ver2",
    lang: {
      t: null
    },
    drawer: false
  },
  mutations: {
    lang: function(state, val) {
      state.lang = val;
    },
    max_z_index: function(state, val) {
      state.max_z_index = val;
    },
    drawer: function(state, val) {
      state.drawer = val;
    }
  },
  getters: {
    t: state => key => {
      if (state.lang.t) {
        return state.lang.t(key);
      }
      return key;
    }
  },
  modules: {
    snackbar,
    search,
    wcards,
    logging,
    loading,
    setting,
    current,
    files,
    metadata,
    hash
  }
});
