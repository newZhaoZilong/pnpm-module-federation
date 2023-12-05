const { defineConfig } = require("@vue/cli-service");
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = defineConfig({
  // transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: "host",
        remotes:{
          'dataMap':"dataMap@http://localhost:3001/remoteEntry.js"
        },
        // exposes: {
        //   './router':'./src/router/index.ts'
        // },
        shared: {
          vue: {
            singleton: true,
            eager: true,
          },
          'vue-router': {
            singleton: true, // only a single version of the shared module is allowed
          },
        }
      })
    ],
    // optimization:{
    //   runtimeChunk:false
    // },
    optimization: {
      splitChunks: false,
  },
    devServer: {
      // static: {
      //   directory: path.join(__dirname),
      // },
      // compress: true,
      port: 3000,
      // hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },
  }

});
