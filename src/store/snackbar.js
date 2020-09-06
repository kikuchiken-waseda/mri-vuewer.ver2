import storage from "@/storage/localStorage.js";
const STORAGE = storage.snackbar;

const DEFAULT_TIMEOUT = -1;
export default {
  namespaced: true,
  state: () => ({
    show: false,
    message: "",
    type: "",
    color: "",
    timeout: Number(STORAGE.get("timeout")) || DEFAULT_TIMEOUT
  }),
  mutations: {
    show: function(state, payload) {
      state.show = payload;
    },
    type: function(state, payload) {
      state.type = payload;
    },
    message: function(state, payload) {
      state.message = payload;
    },
    color: function(state, payload) {
      state.color = payload;
    },
    timeout: function(state, payload) {
      state.timeout = payload;
      STORAGE.set("timeout", Number(payload));
    }
  },
  actions: {
    init(context) {
      context.commit("show", false);
      context.commit("message", "");
      context.commit("color", "");
      context.commit("type", "");
      context.commit("timeout", DEFAULT_TIMEOUT);
    },
    error(context, payload) {
      context.commit("message", payload);
      context.commit("color", "error");
      context.commit("type", "error");
      context.commit("show", true);
    },
    warning(context, payload) {
      context.commit("message", payload);
      context.commit("color", "warning darken-1");
      context.commit("type", "warning");
      context.commit("show", true);
    },
    info(context, payload) {
      context.commit("message", payload);
      context.commit("color", "");
      context.commit("type", "info");
      context.commit("show", true);
    },
    success(context, payload) {
      context.commit("message", payload);
      context.commit("color", "success");
      context.commit("type", "success");
      context.commit("show", true);
    }
  }
};
