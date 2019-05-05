process.env.NODE_ENV = 'development';

var webpack = require("webpack");
var config = require("./webpack.base.config");
var copyWebpack = require('copy-webpack-plugin');

config.entry.app.push("webpack/hot/dev-server");
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(new copyWebpack([{ from: './stimulsoft', to: config.output.path }], {}));
config.devtool = "#inline-source-map";

module.exports = config;