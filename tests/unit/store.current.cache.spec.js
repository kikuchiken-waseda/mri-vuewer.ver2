import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import cache from "@/store/current/cache";

const local = createLocalVue();
local.use(Vuex);

describe("store/current/cache.js", () => {
  let $store;
  beforeEach(() => {
    $store = new Vuex.Store(cache);
  });
  describe("basic", () => {
    test("cache/textgrids の 初期化", () => {
      expect($store.state.textgrids).toEqual([]);
    });

    test("cache/textgrids のデータ追加", () => {
      expect($store.state.textgrids).toEqual([]);
      const textgrid = { ipu: { values: [{ time: 0, text: "" }] } };
      $store.dispatch("setTextgrid", textgrid);
      expect($store.state.textgrids).toEqual([JSON.stringify(textgrid)]);
    });
    test("cache/textgrids のデータ追加(同じデータの場合追加しない)", () => {
      expect($store.state.textgrids).toEqual([]);
      const textgrid = { ipu: { values: [{ time: 0, text: "" }] } };
      $store.dispatch("setTextgrid", textgrid);
      $store.dispatch("setTextgrid", textgrid);
      expect($store.state.textgrids.length).toBe(1);
    });

    test("cache/textgrids の初期化", () => {
      expect($store.state.textgrids).toEqual([]);
      $store.dispatch("setTextgrid", {
        test1: { values: [{ time: 0, text: "" }] }
      });
      $store.dispatch("setTextgrid", {
        test1: {
          values: [
            { time: 0, text: "" },
            { time: 1, text: "" }
          ]
        }
      });
      expect($store.state.textgrids.length).toBe(2);
      $store.dispatch("init");
      expect($store.state.textgrids).toEqual([]);
    });
    test("cache/textgrids の取り出し: 引数なし", () => {
      // 状態設定
      $store.dispatch("init");
      expect($store.state.textgrids).toEqual([]);
      const textgrids = [
        { test1: { values: [{ time: 0, text: "" }] } },
        { test2: { values: [{ time: 0, text: "" }] } },
        { test3: { values: [{ time: 0, text: "" }] } }
      ];
      $store.dispatch("setTextgrid", textgrids[0]);
      $store.dispatch("setTextgrid", textgrids[1]);
      $store.dispatch("setTextgrid", textgrids[2]);
      expect($store.state.textgrids.length).toBe(3);

      // 直前のキャッシュを取り出し
      const cache = $store.getters["textgrids"]();
      expect(cache).toEqual(textgrids[2]);
      expect($store.state.textgrids.length).toBe(2);
    });

    test("cache/textgrids の取り出し", () => {
      // 状態設定
      $store.dispatch("init");
      expect($store.state.textgrids).toEqual([]);
      const textgrids = [
        { test1: { values: [{ time: 0, text: "" }] } },
        { test2: { values: [{ time: 0, text: "" }] } },
        { test3: { values: [{ time: 0, text: "" }] } },
        { test4: { values: [{ time: 0, text: "" }] } }
      ];
      $store.dispatch("setTextgrid", textgrids[0]);
      $store.dispatch("setTextgrid", textgrids[1]);
      $store.dispatch("setTextgrid", textgrids[2]);
      $store.dispatch("setTextgrid", textgrids[3]);
      expect($store.state.textgrids.length).toBe(4);

      // 二つ前のキャッシュを取り出し
      const cache = $store.getters["textgrids"](1);
      expect(cache).toEqual(textgrids[2]);
      expect($store.state.textgrids).toEqual([
        JSON.stringify(textgrids[0]),
        JSON.stringify(textgrids[1])
      ]);
      expect($store.state.textgrids.length).toBe(2);
    });
  });
});
