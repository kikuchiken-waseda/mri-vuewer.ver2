import math from "./math.js";
import color from "./color.js";
import text from "./text.js";
import image from "./image.js";
import dropbox from "./dropbox.js";

export default {
  deepCopy: v => JSON.parse(JSON.stringify(v)),
  color,
  image,
  text,
  math,
  dropbox
};
