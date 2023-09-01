import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import search from "@/store/search";

const local = createLocalVue();
local.use(Vuex);

describe("store/search.js", () => {
  let $store;
  beforeEach(() => {
    $store = new Vuex.Store(search);
  });
  describe("basic", () => {
    test("初期化", () => {
      $store.dispatch("init");
      expect($store.state.query).toEqual({});

      $store.commit("input", "a=1 b=2");
      $store.dispatch("init");
      expect($store.state.query).toEqual({});
    });
    test("検索欄表示", () => {
      $store.dispatch("show");
      expect($store.state.query).toEqual({});
      expect($store.state.show).toEqual(true);

      $store.commit("input", "a=1 b=2");
      $store.dispatch("show");
      expect($store.state.query).toEqual({});
      expect($store.state.show).toEqual(true);
    });

    test("検索語入力", () => {
      $store.commit("input", "a=1 b=2");
      expect($store.state.query).toEqual({ a: "1", b: "2" });
    });
    test("Get args", () => {
      $store.dispatch("init");
      expect($store.getters.args).toEqual([]);

      $store.commit("input", "a");
      expect($store.getters.args).toEqual(["a"]);

      $store.commit("input", "a b");
      expect($store.getters.args).toEqual(["a", "b"]);

      $store.commit("input", "a&b");
      expect($store.getters.args).toEqual(["a", "b"]);

      $store.commit("input", "a&b=1");
      expect($store.getters.args).toEqual(["a"]);
    });
    test("Get norargs", () => {
      $store.dispatch("init");
      expect($store.getters.norargs).toEqual({});

      $store.commit("input", "a=1&b=1");
      expect($store.getters.norargs).toEqual({});

      $store.commit("input", "a!=1&b!=1");
      expect($store.getters.norargs).toEqual({ a: "1", b: "1" });
      $store.commit("input", "a!=1 b!=1");
      expect($store.getters.norargs).toEqual({ a: "1", b: "1" });
      $store.commit("input", "a != 1 b!=1");
      expect($store.getters.norargs).toEqual({ a: "1", b: "1" });

      $store.commit("input", "a!=1&b!=1,2");
      expect($store.getters.norargs).toEqual({
        a: "1",
        b: ["1", "2"]
      });

      $store.commit("input", "a=1&b!=1");
      expect($store.getters.norargs).toEqual({ b: "1" });
    });
    test("Get kwargs", () => {
      $store.dispatch("init");
      expect($store.getters.kwargs).toEqual({});

      $store.commit("input", "a!=1&b!=1");
      expect($store.getters.kwargs).toEqual({});

      $store.commit("input", "a=1&b=1");
      expect($store.getters.kwargs).toEqual({ a: "1", b: "1" });
      $store.commit("input", "a=1&b=1,2");
      expect($store.getters.kwargs).toEqual({
        a: "1",
        b: ["1", "2"]
      });
    });
  });
});
