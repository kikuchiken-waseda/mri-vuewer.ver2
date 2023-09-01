import util from "@/utils/text.js";

describe("utils/text.js", () => {
  test("safe", () => {
    expect(util.checker.isSafe("thisissafe")).toBe(true);
    expect(util.checker.isSafe("this is safe")).toBe(true);
    expect(util.checker.isSafe("this is safe 1")).toBe(true);
    expect(util.checker.isSafe("これは安全ではありません")).toBe(
      false
    );
  });
  test("clean", () => {
    // 半角スペースの連続を一つのスペースに変換
    expect(util.clean("hoge   foo")).toEqual("hoge foo");

    // 全角スペースをスペースに変換
    expect(util.clean("hoge　foo")).toEqual("hoge foo");
    expect(util.clean("hoge　　foo")).toEqual("hoge foo");

    // タブを半角スペースに変換
    expect(util.clean("hoge	foo")).toEqual("hoge foo");
    expect(util.clean("hoge		foo")).toEqual("hoge foo");

    // 上記処理は混在を認める
    expect(util.clean("hoge　 　foo")).toEqual("hoge foo");
    expect(util.clean("hoge 　 　foo")).toEqual("hoge foo");
    expect(util.clean("hoge	 	foo")).toEqual("hoge foo");
    expect(util.clean("hoge 		foo")).toEqual("hoge foo");
  });
  test("trim", () => {
    expect(util.trim(" hoge ")).toEqual("hoge");
    expect(util.trim("  hoge ")).toEqual("hoge");
    expect(util.trim(" hoge  ")).toEqual("hoge");

    expect(util.trim("　hoge　")).toEqual("hoge");
    expect(util.trim("	hoge	")).toEqual("hoge");
    expect(util.trim("hoge　 ")).toEqual("hoge");
    expect(util.trim("hoge	 ")).toEqual("hoge");
  });
  test("toParam", () => {
    expect(util.toParam("a=1&b=2")).toEqual("a=1&b=2");
    expect(util.toParam("hoge ")).toEqual("hoge");
    expect(util.toParam("hoge = foo")).toEqual("hoge=foo");
    expect(util.toParam("hoge  = foo")).toEqual("hoge=foo");
    expect(util.toParam("hoge =  foo")).toEqual("hoge=foo");
    expect(util.toParam("hoge = a + b")).toEqual("hoge=a+b");
    expect(util.toParam("hoge = a+ b")).toEqual("hoge=a+b");
    expect(util.toParam("hoge = a +b")).toEqual("hoge=a+b");
    expect(util.toParam("hoge = a,b")).toEqual("hoge=a+b");
    expect(util.toParam("a = 1 b = 2")).toEqual("a=1&b=2");
    expect(util.toParam("a = 1,2 b = 2")).toEqual("a=1+2&b=2");

    expect(util.toParam("a=1 b!=2")).toEqual("a=1&b!=2");
    expect(util.toParam("a=1 b !=2")).toEqual("a=1&b!=2");
    expect(util.toParam("a=1 b!= 2")).toEqual("a=1&b!=2");
    expect(util.toParam("a=1 b != 2")).toEqual("a=1&b!=2");
    expect(util.toParam("a=1     b != 2")).toEqual("a=1&b!=2");
    expect(util.toParam("a=1 b  != 2")).toEqual("a=1&b!=2");
  });
  test("toQuery", () => {
    expect(util.toQuery("")).toEqual({});
    expect(util.toQuery("a=1&b=2")).toEqual({ a: "1", b: "2" });
    expect(util.toQuery("a=1&b!=2")).toEqual({ a: "1", "b!": "2" });
    expect(util.toQuery("a=1&b")).toEqual({ a: "1", b: true });
    expect(util.toQuery("a=1+2")).toEqual({ a: ["1", "2"] });
  });
});
