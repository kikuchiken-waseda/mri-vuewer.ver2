import Vue from "vue";
import db from "@/storage/db";
import dropbox from "../utils/dropbox";

export default {
  namespaced: true,
  state: () => ({
    files: [],
    chaches: [],
    isLoading: false
  }),
  mutations: {
    chaches: function(state, files) {
      if (Array.isArray(files)) state.chaches = files;
    },
    files: function(state, files) {
      if (Array.isArray(files)) state.files = files;
    },
    push: function(state, obj) {
      state.files.push(obj);
    },
    update: function(state, obj) {
      const idx = state.files.findIndex(x => x.id == obj.id);
      const files = state.files;
      if (idx > -1) {
        files[idx] = obj;
        files[idx].lastModifiedAt = Date.now();
        Vue.set(state.files, idx, files[idx]);
      }
    },
    destroy: function(state, id) {
      const i = state.files.findIndex(x => x.id == id);
      if (i > -1) {
        state.files.splice(i, 1);
      }
    },
    isLoading: function(state, payload) {
      state.isLoading = payload;
    }
  },
  actions: {
    // logging
    getLog: function(context, msg) {
      context.dispatch(
        "logging/dblog",
        { tag: "GET", table: "files", msg: msg },
        { root: true }
      );
    },
    postLog: function(context, msg) {
      context.dispatch(
        "logging/dblog",
        { tag: "POST", table: "files", msg },
        { root: true }
      );
    },
    deleteLog: function(context, msg) {
      context.dispatch(
        "logging/dblog",
        { tag: "DELETE", table: "files", msg },
        { root: true }
      );
    },
    errorLog: function(context, msg) {
      context.dispatch(
        "logging/error",
        { tag: "store/files", msg },
        { root: true }
      );
    },
    init: function(context) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        context.state.files = [];
        db.files
          .toArray()
          .then(files => {
            context.commit("files", files);
            context.dispatch("getLog", "init current status");
            context.commit("isLoading", false);
            resolve(true);
          })
          .catch(error => {
            context.commit("isLoading", false);
            reject(error);
          });
      });
    },
    // ファイルストア初期化
    dropbox: function(context) {
      return new Promise((resolve, reject) => {
        if (dropbox.hasToken()) {
          dropbox
            .get("/data")
            .then(res => {
              const chaches = res.entries.filter(x => x[".tag"] == "file");
              context.commit("chaches", chaches);
              resolve(true);
            })
            .catch(res => reject(res));
        } else {
          resolve(false);
        }
      });
    },
    // ファイル一覧の取得
    load: function(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        db.load(payload)
          .then(files => {
            context.commit("files", files);
            context.dispatch("getLog", "load files");
            context.commit("isLoading", false);
            resolve(true);
          })
          .catch(error => {
            context.commit("isLoading", false);
            reject(error);
          });
      });
    },
    // ファイル一覧を JSON 形式で出力
    dump: function(context) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        db.dump()
          .then(() => {
            context.commit("isLoading", false);
            resolve(true);
          })
          .catch(error => {
            context.commit("isLoading", false);
            reject(error);
          });
      });
    },
    // ファイルDB をクリア
    clear: function(context) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        Promise.all([
          db.points.clear,
          db.rects.clear,
          db.frames.clear,
          db.files.clear
        ])
          .then(() => {
            context.commit("files", []);
            context.commit("isLoading", false);
            resolve(true);
          })
          .catch(error => {
            context.commit("isLoading", false);
            reject(error);
          });
      });
    },
    // 一つのファイルを追加
    push: function(context, obj) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        db.put(obj)
          .then(x => {
            db.files
              .toArray()
              .then(files => {
                context.commit("files", files);
                context.dispatch("postLog", "add a data.");
                context.commit("isLoading", false);
                resolve(x);
              })
              .catch(error => {
                context.commit("isLoading", false);
                reject(error);
              });
          })
          .catch(error => {
            context.commit("isLoading", false);
            reject(error);
          });
      });
    },
    // 一つのファイルを削除
    destroy: function(context, id) {
      return new Promise((resolve, reject) => {
        if (id) {
          context.commit("isLoading", true);
          db.destory(id)
            .then(() => {
              db.files
                .toArray()
                .then(files => {
                  context.commit("files", files);
                  context.dispatch("deleteLog", `delete files: ${id}`);
                  context.commit("isLoading", false);
                  resolve(id);
                })
                .catch(error => {
                  context.commit("isLoading", false);
                  reject(error);
                });
            })
            .catch(error => {
              context.commit("isLoading", false);
              reject(error);
            });
        } else {
          reject(new Error("no id"));
        }
      });
    }
  },
  getters: {
    fields: function(state) {
      const fields = new Set();
      for (const f of state.files) {
        if (f.metaData) {
          for (const k of Object.keys(f.metaData)) {
            fields.add(k);
          }
        }
      }
      return Array.from(fields);
    },
    records: function(state) {
      const records = [];
      let id = 0;
      for (const f of state.files) {
        for (const key in f.textgrid) {
          const tier = f.textgrid[key];
          for (const i in tier.values) {
            const record = tier.values[i];
            const item = {
              fileId: f.id,
              fileName: f.name,
              fps: f.fps,
              duration: f.duration,
              src: f.source,
              tier: key,
              type: tier.type,
              index: i,
              id: id,
              time: record.time,
              text: record.text
            };
            records.push(item);
            id++;
          }
        }
      }
      return records;
    }
  }
};
