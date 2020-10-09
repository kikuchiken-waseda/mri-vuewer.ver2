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
          const n = tier.values.length - 1;
          for (const i in tier.values) {
            const record = tier.values[i];
            const prev = i == 0 ? { time: 0, text: "" } : tier.values[i - 1];
            let releted = {};
            if (tier.type == "interval") {
              for (const rkey in f.textgrid) {
                releted[rkey] = f.textgrid[rkey].values
                  .filter((x, ri) => {
                    const rptime =
                      ri == 0 ? 0 : f.textgrid[rkey].values[ri - 1].time;
                    const check1 =
                      rptime <= releted.time && releted.time <= x.time;
                    const check2 = prev.time <= x.time && x.time <= record.time;
                    return check1 || check2;
                  })
                  .map(x => x.text)
                  .join(" ");
              }
            } else {
              for (const key in f.textgrid) {
                const rtier = f.textgrid[key];
                if (rtier.type == "interval") {
                  releted[key] = f.textgrid[key].values
                    .filter(x => x.time <= record.time && record.time <= x.time)
                    .map(x => x.text);
                } else {
                  releted[key] = f.textgrid[key].values.filter(
                    x => x.time == record.time
                  );
                }
              }
            }
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
              start: prev.time,
              end: record.time,
              time: record.time,
              text: record.text,
              search: {
                field: key,
                text: record.text,
                text__p1: i > 0 ? tier.values[Number(i) - 1].text : "",
                text__p2: i > 1 ? tier.values[Number(i) - 2].text : "",
                text__p3: i > 2 ? tier.values[Number(i) - 3].text : "",
                text__n1: i < n - 1 ? tier.values[Number(i) + 1].text : "",
                text__n2: i < n - 2 ? tier.values[Number(i) + 2].text : "",
                text__n3: i < n - 3 ? tier.values[Number(i) + 3].text : "",
                ...releted
              }
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
