const BASEKEYNAME = "mri-vuewer";
const names = ["wavesurfer", "snackbar", "metadata"];

const get = function(basename, key) {
  const keyname = `${BASEKEYNAME}-${basename}-${key}`;
  const res = localStorage.getItem(keyname);
  if (res == "true") return true;
  if (res == "false") return false;
  return res;
};

const set = function(basename, key, val) {
  const keyname = `${BASEKEYNAME}-${basename}-${key}`;
  localStorage.setItem(keyname, val);
};

let storages = {};
for (const name of names) {
  storages[name] = {
    get: function(key) {
      const basename = name;
      return get(basename, key);
    },
    set: function(key, val) {
      const basename = name;
      set(basename, key, val);
    }
  };
}

export default storages;
