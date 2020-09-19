# MRIViewer: ver2

このアプリケーションは MRI 動画を始めとする調音運動系動画のアノテーションツールです.
類似のアプリケーションとしては Praat や ELAN などが存在しますが,
動画を前提とし, 音声のスペクトルグラムをうまく表示できる適当なツールが存在しないため,
新規に作成しました．

APP: https://kikuchiken-waseda.github.io/mri-vuewer.ver2/
旧版: https://kikuchiken-waseda.github.io/MRIVuewer/

## 動作環境
OS: linux, windows, mac,
推奨ブラウザ: google chrome
動画ファイル: mp4

## 開発者情報
### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration

.env
```
VUE_APP_DROPBOX_REDIRECT="https://<path to this page>/"
VUE_APP_KUROMOJI_DICT="/<repo name>/dict"
```

.env.local
```
VUE_APP_DROPBOX_KEY="<DROPBOX APP KEY>"
```

vue.config.js
```
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/<repo name>/" : "/",
    ...
};
```
