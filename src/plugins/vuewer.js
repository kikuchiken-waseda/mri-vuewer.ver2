import $store from "../store";
import utils from "../utils";

const Vuewer = {
  install: function(vue) {
    const t = key => {
      return $store.getters.t(key);
    };
    const $console = {
      log: function(tag, msg) {
        const item = { msg: msg, tag: tag || "default" };
        $store.commit("logging/log", item);
      },
      error: function(tag, error) {
        const item = { tag: tag };
        if (error instanceof Error) {
          item.msg = error.message;
          console.error(tag, error);
        } else {
          item.msg = error;
        }
        $store.commit("logging/error", item);
      }
    };
    vue.prototype.$vuewer = {
      t: t,
      math: utils.math,
      text: utils.text,
      console: $console,
      db: {
        log: function(table, tag, msg) {
          if (["GET", "POST", "PUT", "DELETE"].indexOf(tag) !== -1) {
            if (table && tag) {
              const item = { msg: msg, table: table, tag: tag };
              $store.commit("logging/dblog", item);
            }
          }
        }
      },
      snackbar: {
        error: function(error) {
          if (error instanceof Error) {
            $store.dispatch("snackbar/error", error.message);
            $console.log(error);
          } else {
            $store.dispatch("snackbar/error", t(error));
          }
        },
        warn: function(message) {
          $store.dispatch("snackbar/warning", t(message));
        },
        warning: function(message) {
          $store.dispatch("snackbar/warning", t(message));
        },
        success: function(message) {
          $store.dispatch("snackbar/success", t(message));
        },
        info: function(msg) {
          $store.dispatch("snackbar/info", t(msg));
        }
      }
    };
  }
};

export default Vuewer;
