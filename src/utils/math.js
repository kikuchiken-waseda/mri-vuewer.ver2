// objects in array を対象に key が val に最も近いオブジェクトを返します.
const nearest = function(array, key, val) {
  const diff = array
    .map(x => {
      return {
        val: val < x[key] ? 100000 : Math.abs(val - x[key]),
        obj: x
      };
    })
    .sort((a, b) => {
      if (a.val < b.val) return 1;
      if (a.val > b.val) return -1;
      return 0;
    })[0];
  return diff.obj;
};

function uniq(array) {
  return Array.from(new Set(array));
}

const round = function(val, base) {
  return Math.round(val * 10 ** base) / 10 ** base;
};

const distance = function(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
};

function padding(num, len) {
  return (Array(len).join("0") + num).slice(-len);
}

export default {
  nearest: nearest,
  distance: distance,
  round: round,
  padding: padding,
  uniq: uniq
};
