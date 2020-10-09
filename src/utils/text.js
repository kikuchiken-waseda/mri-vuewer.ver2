import kuromoji from "kuromoji";
import jaconv from "jaconv";

const builder = kuromoji.builder({
  dicPath: process.env.VUE_APP_KUROMOJI_DICT
});

const clean = str => {
  const reg = /[\t|\x20\u3000|\s]+/g;
  return str.replace(reg, " ");
};

const trim = str => clean(str).replace(/^\s+|\s+$/g, "");

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
