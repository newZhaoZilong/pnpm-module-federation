const { defineConfig } = require("@vue/cli-service");
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
module.exports = defineConfig({
  // transpileDependencies: true,
  lintOnSave: false,
  publicPath:'http://localhost:3001/',
  configureWebpack: {

    
    plugins: [
      new ModuleFederationPlugin({
        name: "dataMap",
        filename: "remoteEntry.js",
        remotes:{
          // 'host':"host@http://localhost:3000/remoteEntry.js"
        },
        exposes: {
          './router':'./src/router/index.ts',
          './Button':'./src/components/Button.vue'
        },
        remotes:{},
        shared: {
        
          vue: {
            singleton: true,
            eager: true,
          }
        }
      })
    ]
    ,
    optimization: {
      splitChunks: false,
  },
    devServer: {
      // static: {
      //   directory: path.join(__dirname),
      // },
      // compress: true,
      port: 3001,
      // hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },
  }

});
