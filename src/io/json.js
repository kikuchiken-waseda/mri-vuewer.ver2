export default {
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
