import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

import { frames } from "../fakers/frames";
import current from "@/store/current";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("store/current/index.js", () => {
  describe("getters", () => {
    test("current/pointTable", () => {
      const store = new Vuex.Store({
        modules: { current }
      });
      store.commit("current/frames", frames);
      const rows = store.getters["current/pointTable"];

      // テーブルの長さはモックデータに points が含まれる全ての行数の総和になる
      const points = frames
        .filter(f => f.points)
        .map(f => f.points)
        .flat();
      expect(rows.length).toBe(points.length + 1);

      // ヘッダーは以下の値である
      expect(rows[0]).toEqual([
        "id",
        "index",
        "time",
        "label",
        "x",
        "y",
        "color"
      ]);
    });
    test("current/polygonTable", () => {
      const store = new Vuex.Store({
        modules: { current }
      });
      store.commit("current/frames", frames);
      const rows = store.getters["current/polygonTable"];

      // テーブルの長さは polygons が含まれる全ての行に存在する points の総数になる
      const points = frames
        .filter(f => f.polygons)
        .map(f =>
          f.polygons
            .filter(pol => pol.points)
            .map(pol => pol.points)
            .flat()
        )
        .flat();
      expect(rows.length).toBe(points.length + 1);
      // ヘッダーは以下の値である
      expect(rows[0]).toEqual([
        "polygon-id",
        "id",
        "index",
        "time",
        "label",
        "x",
        "y",
        "color"
      ]);
    });
  });
});
