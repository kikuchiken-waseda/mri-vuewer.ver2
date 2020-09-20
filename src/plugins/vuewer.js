import $store from "../store";
import utils from "../utils";
import io from "../io";
import db from "../storage/db.js";

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
      io: io,
      download: {
        blob: io.file.download,
        url: io.file.downloadURL
      },
      math: utils.math,
      text: utils.text,
      dropbox: utils.dropbox,
      console: $console,
      db: {
        log: function(table, tag, msg) {
          if (["GET", "POST", "PUT", "DELETE"].indexOf(tag) !== -1) {
            if (table && tag) {
              const item = { msg: msg, table: table, tag: tag };
              $store.commit("logging/dblog", item);
            }
          }
        },
        gets: db.gets,
        get: db.get,
        add: db.add,
        put: db.put,
        destory: db.destory,
        files: db.files,
        frames: db.frames,
        points: db.points,
        rects: db.rects
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
      },
      loading: {
        start: message => $store.dispatch("loading/start", message),
        end: () => $store.dispatch("loading/finish")
      },
      key: {
        summary: function(event) {
          const key = event.key;

          const ctrl = { text: "ctrl", val: event.ctrlKey };
          const alt = { text: "alt", val: event.altKey };
          const shift = { text: "shift", val: event.shiftKey };
          const meta = { text: "meta", val: event.metaKey };

          const keys = [ctrl, alt, shift, meta];
          const xkeys = keys.filter(x => x.val == true).map(x => x.text);
          const xKey = keys.every(x => x.val !== true)
            ? "default"
            : xkeys.join("+");
          return { key, xKey };
        }
      }
    };
  }
};

export default Vuewer;
