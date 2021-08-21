const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//process.env.NODE_ENV == 'production' ? 'production' : 'development';
module.exports = {
  mode: "production", //默认是开发模块
  entry: "./src/index.jsx",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
  },
  devtool: "source-map",
  optimization: {
    // 它可能会合并webpack-bundle-analyzer 输出中的模块的一部分，从而使报告不太详细。 如果你使用此插件，请在分析过程中将其禁用
    concatenateModules: false,
  },
  devServer: {
    hot: true, //热更新插件
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: {
      //browserHistory的时候，刷新会报404. 自动重定向到index.html
      index: "./index.html",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "node_modules"),
    },
    //当你加载一个文件的时候,没有指定扩展名的时候，会自动寻找哪些扩展名
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: "babel-loader",
        options: {
          presets:[
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
          plugins: [//默认引less,我们引css
            ['import', { libraryName: 'antd', style: 'css' }]
          ]
        },
        include:path.resolve('src'),
        exclude:/node_modules/
      },
      {//引入antdesign中用的css
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 0 },
          }
        ]
      },
      {//我们自己的代码都是less
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 3 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "autoprefixer"
                ],
              }
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecesion: 8,
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.(jpg|png|gif|svg|jpeg)$/,
        type:'asset'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin(),
  ],
};