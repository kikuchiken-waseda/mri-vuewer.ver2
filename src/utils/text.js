import kuromoji from "kuromoji";
const builder = kuromoji.builder({ dicPath: "/dict" });

const tokenize = function(text) {
  return new Promise(resolve => {
    builder.build(function(err, tokenizer) {
      const path = tokenizer.tokenize(text);
      resolve(path);
    });
  });
};

const owakati = function(text) {
  return new Promise(resolve => {
    tokenize(text).then(res => {
      if (res) resolve(res.map(x => x.surface_form || ""));
      resolve([]);
    });
  });
};

const oyomi = function(text) {
  return new Promise(resolve => {
    tokenize(text).then(res => {
      if (res) resolve(res.map(x => x.reading || ""));
      resolve([]);
    });
  });
};

const opronunciation = function(text) {
  return new Promise(resolve => {
    tokenize(text).then(res => {
      if (res) resolve(res.map(x => x.pronunciation || ""));
      resolve([]);
    });
  });
};

const obasic = function(text) {
  return new Promise(resolve => {
    tokenize(text).then(res => {
      if (res) resolve(res.map(x => x.basic_form || ""));
      resolve([]);
    });
  });
};

const opos = function(text) {
  return new Promise(resolve => {
    tokenize(text).then(res => {
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
    });
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
