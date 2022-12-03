/*
 * @Author: yanbinru 18303671156@163.com
 * @Date: 2022-12-02 22:39:00
 * @LastEditors: yanbinru 18303671156@163.com
 * @LastEditTime: 2022-12-03 10:26:45
 * @FilePath: /webpack/build/webpack.prod.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production', // 开发模式,打包更加快速,省了代码优化步骤

})