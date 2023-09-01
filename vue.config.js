module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath:
    process.env.NODE_ENV === "production" ? "/mri-vuewer.ver2/" : "/",
  configureWebpack: {
    performance: {
      maxAssetSize: 270000,
      maxEntrypointSize: 700000
    }
  }
};
