const path = require("path");
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //提取css成单独文件
const CopyPlugin = require("copy-webpack-plugin"); //复制public资源，用于加载index.html自定义加载内容
const { VueLoaderPlugin } = require("vue-loader");
const ProgressBarPlugin = require('progress-bar-webpack-plugin')//编译进度条；
// console.log(process.env.NODE_ENV,'process')
const { DefinePlugin } = require("webpack")
const isProd = process.env.NODE_ENV === "production" ? true : false; // 判断是否为生产环境

// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    // {
    //   loader: 'thread-loader',
    //   options: {
    //     workerParallelJobs: 2
    //   }
    // },
    preProcessor,
  ].filter(Boolean);
};
module.exports = {
  entry: path.join(__dirname, "../src/index.ts"), // 入口文件
  // 打包文件出口
  output: {
    filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
    assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
    path: paths.appDist, // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    // publicPath: '/' // 打包后文件的公共前缀路径
  },
  resolve: {
    alias: {
      "@": paths.appSrc,
    },
    extensions: [".js", ".tsx", ".ts", ".vue"],
    // symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 用来匹配 .css 结尾的文件
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/, // 用来匹配 .css 结尾的文件
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s(a|c)ss$/, // 用来匹配 .css 结尾的文件
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/, // 用来匹配 .css 结尾的文件
        use: getStyleLoaders("stylus-loader"),
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset", // webpack5内置模块 会转成base64
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // // 小于10kb的图片会被base64处理
          },
        },
        generator: {
          // 将图片文件输出到 static/imgs 目录中
          // 将图片文件命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的文件扩展名
          // [query]: 添加之前的query参数
          filename: "static/imags/[hash:8][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/, // 处理字体图标或媒体资源
        type: "asset/resource", // 资源模块，不需要转成base64
        generator: {
          filename: "static/media/[hash:8][ext][query]",
        },
      },
      {
        test: /\.js$/,
        include: paths.appSrc,
        use: [
          {
            loader: "babel-loader", // 需要配合使用babel.config.js使用
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
    },
    {
      test: /.ts$/,
         loader: 'ts-loader',
         options: { appendTsSuffixTo: [/.vue$/] }
     }
    ],
  },
  // modules: [
  //   'node_modules',
  //    paths.appSrc,
  // ],
  plugins: [
    new ESLintWebpackPlugin({
      context: paths.appSrc, // 处理入口
      exclude: "node_modules", // 默认值排除不处理范围
      cache: true, //设置缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      // filename: "static/css/[name].css",
      // chunkFilename:"static/css/[name].chunk.css", // 区分主文件，动态导入css文件
      // 定义输出文件名和目录
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          toType: "dir",
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件index.html，防止生成2个index.html
            ignore: ["**/index.html"],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    // cross-env定义的环境变量是给webpack使用的
    // DefinePlugin定义的环境变量是给源代码是用的// 解决vue页面警告
    // new DefinePlugin({
    //   __VUE_OPTIONS_API__: "true",
    //   __VUE_PROD_DEVTOOLS__: "false",
    // }),
    // 进度条
    new ProgressBarPlugin(),
  ],

};
