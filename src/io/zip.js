import JsZip from "jszip";

function toZip(files) {
  return new Promise((resolve, reject) => {
    try {
      let zip = new JsZip();
      for (const f of files) {
        zip.file(f.name, f.base64.split(",")[1], { base64: true });
      }
      zip
        .generateAsync({ type: "blob" })
        .then(content => {
          resolve(content);
        })
        .catch(error => reject(error));
    } catch (e) {
      reject(e);
    }
  });
}

export default {
  toZip: toZip
};
