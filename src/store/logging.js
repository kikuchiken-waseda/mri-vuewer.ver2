export default {
  namespaced: true,
  state: () => ({
    logs: [],
    errors: [],
    dbLogs: [],
    show: false
  }),
  mutations: {
    show: function(state, payload) {
      state.show = payload;
    },
    log: function(state, payload) {
      const item = {
        time: Date.now(),
        msg: payload.msg,
        tag: payload.tag || "default"
      };
      state.logs.push(item);
    },
    dblog: function(state, payload) {
      if (payload.msg && payload.tag && payload.table) {
        const item = {
          time: Date.now(),
          tag: payload.tag,
          table: payload.table,
          msg: payload.msg
        };
        state.dbLogs.push(item);
      }
    },
    error: function(state, payload) {
      const item = {
        time: Date.now(),
        tag: payload.tag,
        msg: payload.msg
      };
      state.errors.push(item);
    }
  },
  actions: {
    dblog: function(context, payload) {
      context.commit("dblog", payload);
    },
    error: function(context, payload) {
      context.commit("error", payload);
    }
  }
};
