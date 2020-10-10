import kuromoji from "kuromoji";
import jaconv from "jaconv";

const builder = kuromoji.builder({
  dicPath: process.env.VUE_APP_KUROMOJI_DICT
});

const clean = str => {
  const sreg = /[\t|\x20\u3000|\s]+/g;
  const zreg = /[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
  return str
    .replace(sreg, " ")
    .replace(zreg, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[‐－―]/g, "-")
    .replace(/[～〜]/g, "~");
};
const trim = str => clean(str).replace(/^\s+|\s+$/g, "");

const toParam = str => {
  const reg = /\s*[||,|+]\s*/g;
  return trim(str)
    .replace(/\s*[=|:]\s*/g, "=")
    .replace(/\s*!=\s*/g, "!=")
    .replace(reg, "+")
    .replace(/\s/g, "&");
};

const toQuery = param => {
  return [...new URLSearchParams(param).entries()].reduce((obj, e) => {
    const val = e[1].indexOf(" ") > -1 ? e[1].split(" ") : e[1];
    return {
      ...obj,
      [e[0]]: val ? val : true
    };
  }, {});
};

const query = str => {
  return toQuery(toParam(str));
};

const checker = {
  isSafe: str => (str.match(/^[0-9a-zA-Z|\s]*$/) ? true : false)
};

const tokenize = function(text) {
  return new Promise((resolve, reject) => {
    try {
      builder.build(function(err, tokenizer) {
        try {
          const path = tokenizer.tokenize(text);
          resolve(path);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const owakati = function(text) {
  return new Promise((resolve, reject) => {
    tokenize(text)
      .then(res => {
        if (res) resolve(res.map(x => x.surface_form || ""));
        resolve([]);
      })
      .catch(error => reject(error));
  });
};

const oyomi = function(text) {
  return new Promise((resolve, reject) => {
    tokenize(text)
      .then(res => {
        if (res) resolve(res.map(x => x.reading || x.surface_form));
        resolve([]);
      })
      .catch(error => reject(error));
  });
};

const opronunciation = function(text) {
  return new Promise((resolve, reject) => {
    tokenize(text)
      .then(res => {
        if (res) resolve(res.map(x => x.pronunciation || ""));
        resolve([]);
      })
      .catch(error => reject(error));
  });
};

const obasic = function(text) {
  return new Promise((resolve, reject) => {
    tokenize(text)
      .then(res => {
        if (res) resolve(res.map(x => x.basic_form || ""));
        resolve([]);
      })
      .catch(error => reject(error));
  });
};

const opos = function(text) {
  return new Promise((resolve, reject) => {
    tokenize(text)
      .then(res => {
        const results = res.map(x => {
          const pos = [
            x.pos,
            x.pos_detail_1,
            x.pos_detail_2,
            x.pos_detail_3
          ].filter(x => !!x && x != "*");
          return pos.join("-");
        });
        resolve(results);
      })
      .catch(error => reject(error));
  });
};

const toHiragana = s => {
  return jaconv.toHiragana(s);
};
const toHebon = s => {
  const x = jaconv.toHiragana(s);
  return jaconv.toHebon(x).toLowerCase();
};
export default {
  clean,
  trim,
  toParam,
  toQuery,
  query,
  checker,
  tokenize: tokenize,
  owakati: owakati,
  oyomi: oyomi,
  opronunciation: opronunciation,
  obasic: obasic,
  toHiragana,
  toHebon,
  opos: opos
};
