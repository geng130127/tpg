const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

function resolve(dir) {
  return path.join(__dirname, dir)
};

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',//输出文件目录
  assetsDir: 'static', //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  productionSourceMap: false, //生产环境是否生成 sourceMap 文件，一般情况不建议打开；是否允许调试
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@components', resolve('src/components'))
      .set('@common', resolve('src/common'))
      .set('@assets', resolve('src/assets'))
      .set('@store', resolve('src/store'));


    const imagesRule = config.module.rule('images'); //获取images处理规则
    imagesRule.exclude.add(resolve('src/icons')); //排除icons目录
    config.module
      .rule("images") //图片压缩
      .test(/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/) //处理的文件
      .use("image-webpack-loader") //打开
      .loader("image-webpack-loader")//加载
      .options({
        mozjpeg: {progressive: true, quality: 65},
        optipng: {enabled: false},
        pngquant: {quality: "65-90", speed: 4},
        gifsicle: {interlaced: false},
        webp: {quality: 75}
      }).end();

    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      const plugins = [];
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;//生成环境注释console
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs=['console.log'];//生成环境删除console
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
      config.plugins = [
        ...config.plugins,
        ...plugins
      ];

    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin //开发环境设置为false，生成环境设置为true；不然css无法热更新
    extract: (process.env.NODE_ENV === 'production' ? true : false),
    // 开启 CSS source maps?是否在构建样式地图，false将提高构建速度
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  devServer: {
    host: 'localhost', // 地址
    port: 8080, //端口号设置，端口号占用出现问题可在此处修改
    open: true, //配置自动启动浏览器  http://172.16.1.12:7071/rest/mcdPhoneBar/
    hotOnly: true, // 热更新
    disableHostCheck: true, //使用反向代理配置
    proxy: {
      '/apolloApi': {
        target: 'http://47.101.217.119/graphql.php',
        // secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/apolloApi': ''
        }
      },
      '/restfulApi':{
        target: 'http://47.101.217.119',
        changeOrigin: true,
        pathRewrite: {
          '^/restfulApi': ''
        }
      },
    },
  }
};
