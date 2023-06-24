const express = require('express');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const opn = require('opn');
const { argv } = require('process');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const proxy = require('express-http-proxy')
const config = require('../webpack.config');
const buildConfig = require('../webpack.build.config');
const proxyConfig = require('./http_proxy');

/***
 * todo 后续需要完善的地方
 * 1.package.json 启动脚本加上参数配置 argv === build(打包) | remote（联调） | dev (本地mock)
 * 2.启动开发之后自动打开 url
 * ...其他还没想好做什么功能
 */
const app = express();

const argvObj = {};
argv.forEach((val) => {
  const exp = val.split('=');
  console.log(exp.length);
 
  if (exp.length === 1) {
    argvObj[exp[0]] = true;
  }
  if (exp.length === 2) {
    argvObj[exp[0]] = exp[1]
    console.log(argvObj)
  }
});

// const webpackConfig = argvObj.mode === 'build' ? buildConfig : config;
// const compile = webpack(webpackConfig);

// 编译
if (argvObj.mode === 'build') {
  webpack(buildConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      // 在这里处理错误
      console.error(err);
      return;
    }
    // 处理完成
    console.log(stats.toString({
      chunks: false,  // 使构建过程更静默无输出
      colors: true    // 在控制台展示颜色
    }));
  });
}

// 开发模式
if (argvObj.mode === 'dev' || argvObj.mode === 'remote') {
  const compile = webpack(config);
  const webpackDevMiddleware = WebpackDevMiddleware(compile, {
    publicPath: '/'
  });
  const webpackHotMiddleware = WebpackHotMiddleware(compile, {
    log: false,
    heartbeat: 2000,
    publicPath: '/'
  });
  
  app.use(webpackDevMiddleware);
  app.use(webpackHotMiddleware);
  
  app.use(express.static(config.output.path))
  
  // remote 联调模式
  if (argvObj.mode === 'remote') {
    Object.keys(proxyConfig).forEach(key => {
      console.log(key);
      app.use(key, proxy(proxyConfig[key]));
    })
  };
  
  // 本地mock
  app.use(function(req, res, next) {
      const mockFilePath = path.join(__dirname, '../', 'mock', req.path);
      console.log(mockFilePath, '----');
      if (fs.existsSync(mockFilePath)) {
          res.set('Content-Type', 'application/json; charset=UTF-8');
          res.send(fs.readFileSync(mockFilePath));
      }
      next();
  });

  const port = 5123;
  const uri = `http://localhost:${port}`;
  webpackDevMiddleware.waitUntilValid(() => {
      console.log(`Listening at \n${uri}\n`)
      opn(`${uri}`, {app: ['google chrome', '--incognito']});
      console.log(`${config.output.path}`);
  });
  
  app.listen(port);
}

