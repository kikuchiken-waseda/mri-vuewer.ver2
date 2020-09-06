const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const toBlob = dataUrl => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const toBuff = dataUrl => {
  const byteString = atob(dataUrl.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return ab;
};

const toUnit8Array = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = error => reject(error);
  });

const fetchFile = async function(url, filename, metadata) {
  const response = await fetch(url, { mode: "cors", method: "GET" });
  if (response.status == 200) {
    const data = await response.blob();
    const file = new File([data], filename, metadata);
    return file;
  } else {
    throw new Error(response.statusText);
  }
};

const download = function(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = name;
  a.href = url;
  a.click();
  a.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1e4);
};

export default {
  toBase64: toBase64,
  toBlob: toBlob,
  toBuff: toBuff,
  toUnit8Array: toUnit8Array,
  fetch: fetchFile,
  download: download
};
