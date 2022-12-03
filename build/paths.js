/*
 * @Author: yanbinru 18303671156@163.com
 * @Date: 2022-12-03 10:12:20
 * @LastEditors: yanbinru 18303671156@163.com
 * @LastEditTime: 2022-12-03 10:51:20
 * @FilePath: /webpack/build/paths.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs= require('fs')
const path=require('path')
// fs模块同时提供了异步和同步的方法
// fs.readFile异步读取时，传入的回调函数接收两个参数，当正常读取时，err参数为null，data参数为读取到的String。当读取发生错误时，err参数代表一个错误对象，data为undefined。这也是Node.js标准的回调函数：第一个参数代表错误信息，第二个参数代表结果。后面我们还会经常编写这种回调函数
// fs.readFileSync 并且不接收回调函数，函数直接返回结果

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    resolveApp,
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appSrc: resolveApp('src'),
    appDist: resolveApp('dist'),
    appTsConfig: resolveApp('tsconfig.json'),
  }