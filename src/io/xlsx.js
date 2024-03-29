import XLSX from "xlsx";
function obj2wb(data) {
  const names = Object.keys(data);
  const sheets = {};
  for (const key in data) {
    sheets[key] = XLSX.utils.aoa_to_sheet(data[key]);
  }
  return { SheetNames: names, Sheets: sheets };
}

function wb2buff(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i)
    view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

function dump(obj) {
  var write_opts = {
    type: "binary"
  };
  var wb = obj2wb(obj);
  var wb_out = XLSX.write(wb, write_opts);
  var blob = new Blob([wb2buff(wb_out)], {
    type: "application/octet-stream"
  });
  return blob;
}

function load(file, sheetName) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = event => {
      try {
        const data = new Uint8Array(event.target.result);
        const book = XLSX.read(data, {
          type: "array"
        });
        const sheet = XLSX.utils.sheet_to_json(
          book.Sheets[sheetName],
          { header: 1 }
        );
        resolve(sheet);
      } catch (error) {
        reject(error);
      }
    };
    fr.onerror = error => reject(error);
    fr.readAsArrayBuffer(file);
  });
}

export default {
  dump,
  load
};
