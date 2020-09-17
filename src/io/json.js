export default {
  read: file => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onloadend = event => {
        const content = event.target.result;
        resolve(JSON.parse(content));
      };
      fr.onerror = error => reject(error);
      fr.readAsText(file);
    });
  },
  toBlob: obj => {
    return new Blob([JSON.stringify(obj, null, "  ")], {
      type: "application/json"
    });
  },
  toFile: (name, obj) => {
    const blob = new Blob([JSON.stringify(obj, null, "  ")], {
      type: "application/json"
    });
    blob.name = name;
    blob.lastModifiedDate = new Date();
    return blob;
  }
};
