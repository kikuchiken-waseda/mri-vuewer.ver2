import db from "@/storage/db";

export default {
  namespaced: true,
  state: () => ({
    files: [],
    isLoading: false,
    count: 0
  }),
  mutations: {
    files: function(state, obj) {
      state.files = obj;
    },
    push: function(state, obj) {
      state.files.push(obj);
      state.count = state.count + 1;
    },
    update: function(state, obj) {
      const idx = state.files.findIndex(x => x.id == obj.id);
      if (idx > -1) {
        state.files[idx] = obj;
      }
    },
    destroy: function(state, id) {
      const i = state.files.findIndex(x => x.id == id);
      if (i > -1) {
        state.files.splice(i, 1);
        state.count = state.count - 1;
      }
    },
    isLoading: function(state, payload) {
      state.isLoading = payload;
    },
    count: function(state, payload) {
      state.count = payload;
    }
  },
  actions: {
    // ファイルストア初期化
    init: function(context) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        context.state.files = [];
        db.files
          .count()
          .then(x => {
            context.commit("count", x);
            db.files
              .toArray()
              .then(items => {
                for (const x of items) {
                  context.commit("push", x);
                }
                context.dispatch(
                  "logging/dblog",
                  {
                    tag: "GET",
                    table: "files",
                    msg: "init current status"
                  },
                  { root: true }
                );
                context.commit("isLoading", false);
                resolve(true);
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
    // ファイル一覧の取得
    load: function(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        db.load(payload)
          .then(items => {
            context.state.files = items;
            context.commit("count", items.length);
            context.dispatch(
              "logging/dblog",
              {
                tag: "GET",
                table: "files",
                msg: "load files"
              },
              { root: true }
            );
            resolve(true);
          })
          .catch(error => reject(error))
          .finally(() => context.commit("isLoading", false));
      });
    },
    // ファイル一覧を JSON 形式で出力
    dump: function(context) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        db.dump()
          .then(() => resolve(true))
          .catch(error => reject(error))
          .finally(() => context.commit("isLoading", false));
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
            context.state.files = [];
            resolve(true);
          })
          .catch(error => reject(error))
          .finally(() => context.commit("isLoading", false));
      });
    },
    // 一つのファイルを追加
    push: function(context, obj) {
      return new Promise((resolve, reject) => {
        context.commit("isLoading", true);
        db.put(obj)
          .then(async function() {
            const files = await db.files.toArray();
            context.commit("files", files);
            context.dispatch(
              "logging/dblog",
              {
                tag: "GET",
                table: "files",
                msg: "init current status"
              },
              { root: true }
            );
            context.commit("isLoading", false);
            resolve(true);
          })
          .catch(error => reject(error))
          .finally(() => context.commit("isLoading", false));
      });
    },
    // 一つのファイルを削除
    destroy: function(context, id) {
      const $destroy = async (resolve, reject, id) => {
        context.commit("isLoading", true);
        try {
          await db.destory(id);
          context.dispatch(
            "logging/dblog",
            {
              tag: "DELETE",
              table: "files",
              msg: `delete files: ${id}`
            },
            { root: true }
          );
          resolve(id);
        } catch (error) {
          reject(error);
        }
        context.commit("isLoading", false);
      };
      return new Promise((resolve, reject) => {
        if (id) {
          $destroy(resolve, reject, id);
        } else {
          reject(new Error("no id"));
        }
      });
    }
  },
  getters: {
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
