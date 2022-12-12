const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");
// 按需加载
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const {
  ElementPlusResolver,
  AntDesignVueResolver,
} = require("unplugin-vue-components/resolvers");
module.exports = merge(common, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新
    AutoImport({
      //按需加载
      resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(
          // 自定义主题配置
          { importStyle: "sass" }
        ),
        AntDesignVueResolver(),
      ],
    }),
  ],
  devtool: "eval-cheap-module-source-map", // 源码调试模式,后面会讲
  devServer: {
    port: 3000, // 服务端口号
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    },
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },

});
