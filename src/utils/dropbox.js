import { Dropbox } from "dropbox";
import storages from "@/storage/localStorage";
const conf = {
  key: process.env.VUE_APP_DROPBOX_KEY,
  redirect: process.env.VUE_APP_DROPBOX_REDIRECT,
  token: storages.dropbox.get("token")
};
let CLIENT = new Dropbox({ clientId: conf.key, accessToken: conf.token });

const auth = function() {
  const authUrl = CLIENT.getAuthenticationUrl(
    process.env.VUE_APP_DROPBOX_REDIRECT
  );
  window.location.href = authUrl;
};

const setToken = function(text) {
  const info = text.split("&")[0].split("=");
  if (info[0] == "#access_token") {
    const token = text.split("&")[0].split("=")[1];
    conf.token = token;
    storages.dropbox.set("token", token);
    CLIENT = new Dropbox({ clientId: conf.key, accessToken: conf.token });
  }
};

const get = function(path) {
  return new Promise((resolve, reject) => {
    CLIENT.filesListFolder({ path: path })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};
const write = function(path, file) {
  return new Promise((resolve, reject) => {
    CLIENT.filesUpload({ path: "/" + path, contents: file, mode: "overwrite" })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

const read = function(path, blob = false) {
  return new Promise((resolve, reject) => {
    CLIENT.filesDownload({ path: path })
      .then(res => {
        if (res.fileBlob) {
          if (blob) {
            resolve(res.fileBlob);
          } else {
            const fr = new FileReader();
            fr.onerror = () => {
              fr.abort();
              const error = new Error("LOAD ERROR");
              reject({ status: 500, error: error });
            };
            fr.onload = () => {
              resolve(fr.result);
            };
            fr.readAsText(res.fileBlob);
          }
        } else {
          const error = new Error("API ERROR");
          reject({ status: 500, error: error });
        }
      })
      .catch(error => reject(error));
  });
};

export default {
  auth: auth,
  hasToken: () => {
    if (storages.dropbox.get("token")) return true;
    return false;
  },
  setToken: setToken,
  write: write,
  read: read,
  get: get
};
