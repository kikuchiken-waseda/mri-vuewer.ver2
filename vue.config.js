module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: process.env.NODE_ENV === "production" ? "/mri-vuewer.dev/" : "/",
  configureWebpack: {
    performance: {
      maxAssetSize: 270000,
      maxEntrypointSize: 700000
    }
  }
};
