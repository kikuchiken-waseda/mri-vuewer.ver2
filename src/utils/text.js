import kuromoji from "kuromoji";
const builder = kuromoji.builder({
  dicPath: process.env.VUE_APP_KUROMOJI_DICT
});

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
        if (res) resolve(res.map(x => x.reading || ""));
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

export default {
  tokenize: tokenize,
  owakati: owakati,
  oyomi: oyomi,
  opronunciation: opronunciation,
  obasic: obasic,
  opos: opos
};
