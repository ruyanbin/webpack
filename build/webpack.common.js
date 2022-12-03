/*
 * @Author: yanbinru 18303671156@163.com
 * @Date: 2022-12-02 22:38:41
 * @LastEditors: yanbinru 18303671156@163.com
 * @LastEditTime: 2022-12-03 11:07:47
 * @FilePath: /webpack/build/webpack.base.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('path')
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: path.join(__dirname, '../src/index.js'), // 入口文件
    // 打包文件出口
    output: {
        // filename: 'static/js/[name].js', // 每个输出js的名称
        filename: '[name].bundle.js' || '[name].[contenthash].bundle.js',

        // path: path.join(__dirname, '../dist'), // 打包结果输出路径
        path: paths.appDist, // 打包结果输出路径

        clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
        // publicPath: '/' // 打包后文件的公共前缀路径
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
        extensions: ['.js', '.tsx', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 预设执行顺序由右往左,所以先处理ts,再处理jsx
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: [
                    paths.appSrc,
                ],
                type: 'asset/resource',
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/i,
                include: [
                    paths.appSrc,
                ],
                type: 'asset/resource',
            },
            {
                test: /\.css$/,
                include: paths.appSrc,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    'css-loader',
                ],
            },
            {
                test: /\.module\.(scss|sass)$/,
                include: paths.appSrc,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    // 'css-loader',
                    {
                        loader: "css-loader",
                        options: {
                            //启用CSS模块功能
                            modules: true,
                            importLoaders: 2,
                        }
                    },
                    // 将 PostCSS 编译成 CSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // postcss-preset-env 包含 autoprefixer
                                        'postcss-preset-env',
                                    ],
                                ],
                            },
                        },
                    },

                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ],
            },
            {
                test: /.less$/,
                include: paths.appSrc,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    {
                        loader: "css-loader",
                        options: {
                            //启用CSS模块功能
                            modules: true,
                            importLoaders: 2,
                        }
                    },
                    // 将 PostCSS 编译成 CSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // postcss-preset-env 包含 autoprefixer
                                        'postcss-preset-env',
                                    ],
                                ],
                            },
                        },
                    },
                    // 将 less 编译成 CSS
                    'less-loader',
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
            inject: true, // 自动注入静态资源
        })
    ]
}