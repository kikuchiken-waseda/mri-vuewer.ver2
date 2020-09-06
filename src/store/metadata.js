import storage from "@/storage/localStorage.js";
const S = storage.metadata;
export default {
  namespaced: true,
  state: () => ({
    fields: new Set(JSON.parse(S.get("fields")) || [])
  }),
  mutations: {
    add: function(state, obj) {
      state.fields.add(obj);
      S.set("fields", JSON.stringify(Array.from(state.fields)));
    },
    destroy: function(state, key) {
      if (state.fields.has(key)) {
        state.fields.delete(key);
        S.set("fields", JSON.stringify(Array.from(state.fields)));
      }
    }
  }
};
