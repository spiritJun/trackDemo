
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const appConfig = require('./src/utils/config.js')

const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];

const path = require('path')
const isProduction = process.env.NODE_ENV === 'production';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  //基本路径
  publicPath: './',
  //输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: './',
  //以多页模式构建应用程序。
  pages: undefined,
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  //生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,
  // webpack配置
  //对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    // 删除懒加载模块的prefetch，降低带宽压力
    config.plugins.delete('prefetch');
    config
      .entry('index')
      .add('babel-polyfill')
      .end();
    config
      .when(isProduction,
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 只打包初始时依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  },
  //调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  configureWebpack: config => {
    config.resolve = {
      alias: {
        '@': resolve('src'),
        'src': path.resolve(__dirname, 'src'),
        'assets': path.resolve(__dirname, 'src/assets'),
        'components': path.resolve(__dirname, 'src/components'),
        'views': path.resolve(__dirname, 'src/views'),
        'api': path.resolve(__dirname, 'src/api'),
        'utils': path.resolve(__dirname, 'src/utils'),
        'store': path.resolve(__dirname, 'src/store'),
        'router': path.resolve(__dirname, 'src/router')
      },
      extensions: ['.js', '.json', '.vue'],
    }
    let commonPlugins = [
      // 生成仅包含颜色的替换样式（主题色等）
      new ThemeColorReplacer({
        fileName: 'style/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(appConfig.themeColor), '#0cdd3a', '#EE5A49', '#ffffff'
        ],
        changeSelector: forElementUI.changeSelector,
        isJsUgly: process.env.NODE_ENV === 'production' ? true : undefined
      })
    ]
    let productPlugins = [
      // 开启gzip压缩
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), //匹配文件名
        threshold: 10240, //对10K以上的数据进行压缩
        minRatio: 0.8,
        deleteOriginalAssets: false //是否删除源文件
      }),
      // 打包后删除console
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      })
    ]
    if (isProduction) {
      config.plugins = [...config.plugins, ...commonPlugins, ...productPlugins];
    } else {
      config.plugins = [...config.plugins, ...commonPlugins];
    }

  },
  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  devServer: {
    open: true,
    port: 8080,
    proxy: { //配置自动启动浏览器
      "/shipper": {
        target: 'https://pfshippertest.bjkcwl.com', //https://blog.csdn.net/idomyway/article/details/94358986
        changeOrigin: true,
        secure: false,
        ws: true,//websocket支持
        pathRewrite: {
          '^/shipper': '/shipper'
        }
      },
    }
  },

};