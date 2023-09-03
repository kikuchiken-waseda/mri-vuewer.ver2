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
import hash from "./hash.js";
import packageInfo from "../../package.json";

Vue.use(Vuex);

/* indexedDB で利用可能なストレージ容量を取得 */
export const getStorageSize = async () => {
  const estimation = await navigator.storage.estimate();
  return {
    quota: estimation.quota,
    useage: estimation.usage
  };
};

export default new Vuex.Store({
  state: {
    appName: "MRI Vuewer",
    appVersion: packageInfo.version,
    author: "qh73xe",
    devYear: "2017-2023",
    github: "https://github.com/kikuchiken-waseda/mri-vuewer.ver2",
    lang: {
      t: null
    },
    drawer: false,
    storageSize: {
      quota: null,
      useage: null
    }
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
    },
    storageSize: async state => {
      try {
        state.storageSize = await getStorageSize();
      } catch {
        state.storageSize = {
          quota: null,
          useage: null
        };
      }
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
    hash
  }
});
