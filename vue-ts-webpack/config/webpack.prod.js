
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//使用 cssnano 优化和压缩 CSS。
const TerserWebpackPlugin = require("terser-webpack-plugin"); // js压缩
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//打包体积分析
module.exports = merge(common, {
    mode: 'production', // 开发模式,打包更加快速,省了代码优化步骤
    optimization: {
        // webpack5一般存放压缩位置
        // webpack5一般存放压缩位置
        minimize: true,
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面，效果一样的
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin(
                {
                    parallel: 4,//使用多进程并发运行以提高构建速度。 并发运行的默认数量：
                    //  minify:TerserWebpackPlugin.swcMinify, //允许你自定义压缩函数。 默认情况下，插件使用 terser 库。 对于使用和测试未发布的版本或 fork 的代码很帮助。
                    extractComments:"all",//all|some //是否将注释剥离到单独的文件中（请参阅详细信息）。 默认情况下，仅剥离 /^\**!|@preserve|@license|@cc_on/i 正则表达式匹配的注释，其余注释会删除。
                    terserOptions: {
                        ecma: undefined,
                        warnings: false,
                        parse: {
                            ecma: 8,
                        },
                        
                        compress: {
                          drop_console: true,
                          drop_debugger: false,
                          pure_funcs: ['console.log'] // 移除console
                        }
                      },
                }
            )
        ],
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
            // 其他内容用默认配置即可
        },
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
    plugins:[
        // new BundleAnalyzerPlugin()
    ]
})