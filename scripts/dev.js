const express = require('express');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config');

/***
 * todo 后续需要完善的地方
 * 1.package.json 启动脚本加上参数配置 argv === build(打包) | remote（联调） | dev (本地mock)
 * 2.启动开发之后自动打开 url
 * ...其他还没想好做什么功能
 */
const compile = webpack(config);
const app = express();

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

// 本地mock
app.use(function(req, res, next) {
    const mockFilePath = path.join(__dirname, '../', 'mock', req.path);
    console.log(mockFilePath);
    if (fs.existsSync(mockFilePath)) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send(fs.readFileSync(mockFilePath));
    }
    next();
});


const port = 5123;


const uri = `http://localhost:${port}`;
webpackDevMiddleware.waitUntilValid(() => {
    console.log(`Listening at ${uri}.\n`)
    console.log(`${config.output.path}`);
});

app.listen(port);
