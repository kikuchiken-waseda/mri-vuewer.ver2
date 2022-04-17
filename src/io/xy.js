import { wanted_headers } from "./xy_utils";
export class XYError extends Error {
  constructor(reason, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, XYError);
    }
    this.reason = reason;
    this.name = "XYError";
  }
}

function checkHeader(header) {
  const diff = wanted_headers.filter(i => header.indexOf(i) == -1);
  return diff.length === 0;
}

function getRow(row, start, last) {
  return row.slice(start, start + last);
}

function toXY(cols) {
  const data = [];
  for (const i in cols) {
    if (i % 2 === 1) {
      data.push({
        x: parseInt(cols[i - 1]),
        y: parseInt(cols[i])
      });
    }
  }
  return data;
}

function parseRow(row) {
  const tng = toXY(getRow(row, 1, 80));
  const ulp = toXY(getRow(row, 81, 30));
  const llp = toXY(getRow(row, 111, 50));
  const plt = toXY(getRow(row, 161, 60));
  const upw = toXY(getRow(row, 221, 56));
  const atw = toXY(getRow(row, 277, 30));

  return {
    tng,
    ulp,
    llp,
    plt,
    upw,
    atw
  };
}

function parseXY(data) {
  const rows = data
    .split("\n")
    .map(row => row.split(",").map(col => col.trim()));
  const [header, ...body] = rows;
  if (!checkHeader(header)) {
    throw new XYError("invalidHeader");
  }
  try {
    const result = body.map(data => parseRow(data));
    return result;
  } catch {
    throw new XYError("invalidBody");
  }
}

export default {
  read: file => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onloadend = event => {
        try {
          const content = parseXY(event.target.result);
          resolve(content);
        } catch (error) {
          reject(error);
        }
      };
      fr.onerror = error => reject(error);
      fr.readAsText(file);
    });
  },
  getColor: key => {
    const colorMap = {
      tng: "#FFFF8D",
      ulp: "#FF8A80",
      llp: "#FF80AB",
      plt: "#B9F6CA",
      upw: "#82B1FF",
      atw: "#B388FF"
    };
    return colorMap[key];
  }
};
