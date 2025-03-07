Object.defineProperty(exports, '__esModule', { value: true });

const webpack = require("webpack");
const fs = require('fs');
const path = require('path');



const index = (ctx, options) => {
  console.log('IncrementVersionPlugin start=======>');

//   ctx.modifyWebpackChain(({ chain }) => {
//     console.log("chain.devServer",chain.devServer);

//     console.log("file",path.resolve(__dirname, 'dev-version.json'))
//     chain.devServer.watchOptions({
//       ignored: [path.resolve(__dirname, 'dev-version.json')]
//     });

// });


//   ctx.modifyWebpackChain(({ chain }) => {
//     chain
//         .plugin('definePlugin')
//         .tap(args => {
//         console.log("args",args)
//         return args;
//     });
// });



// ctx.apply(compiler) {
//   compiler.hooks.done.tap('CustomPlugin', (stats) => {
//     if (stats.compilation.options.mode === 'development') {
//       // 触发自定义脚本
//      // require('./your-custom-script.js')()
//     }
//   })
// }

// ctx.modifyWebpackChain(chain) {
//   chain.plugin('hmr-hook').use(new webpack.HotModuleReplacementPlugin());
//   chain.plugin('custom-script').use({
//     apply: (compiler) => {
//       compiler.hooks.done.tap('CustomScriptPlugin', () => {
//         console.log('HMR 触发，执行自定义脚本...');
//         // exec('node my-script.js', (err, stdout, stderr) => {
//         //   if (err) {
//         //     console.error(`执行失败: ${stderr}`);
//         //   } else {
//         //     console.log(`执行结果: ${stdout}`);
//         //   }
//         // });
//       });
//     }
//   });
// }



  ctx.modifyWebpackChain(({ chain }) => {

    // chain.devServer.watchOptions({
    //       watchOptions: {
    //         ignored: (filePath) => {
    //           console.log("filePath", filePath);
    //           // const targetFile = path.resolve(__dirname, '../src/version.json')
    //           // return filePath.includes(targetFile) ||
    //           //        /node_modules/.test(filePath)
    //         },
    //       },
    //     });

      //  chain.plugin('hmr-hook').use(new webpack.HotModuleReplacementPlugin());

      //  chain.plugin('custom-script').use({
      //   apply: (compiler) => {
      //     compiler.hooks.done.tap('CustomScriptPlugin', () => {
      //       console.log('HMR 触发，执行自定义脚本...');

      //       try {
      //         const filePath = options.filePath || './dev-version.json';


      //         const fullPath = path.resolve(compiler.context, filePath);
      //         console.log("filePath",fullPath);
      //         const versionData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      //         // 版本号递增
      //         versionData.version++;
      //         fs.writeFileSync(fullPath, JSON.stringify(versionData, null, 2));

      //         this.lastUpdate = Date.now();
      //         console.log(`✅ Version 更新至 ${versionData.version}`);
      //       } catch (e) {
      //         console.error('Version 更新失败:', e);
      //       }
      //     });
      //   }
      // });
});


}


exports.default = index;



