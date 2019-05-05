process.env.NODE_ENV = 'production';

var path = require("path");
var webpack = require("webpack");
var config = require("./webpack.base.config");
var copyWebpack = require('copy-webpack-plugin');

config.output.path = path.join(__dirname, "../Pawnshop.Web/wwwroot/assets");
config.plugins.push(new webpack.optimize.UglifyJsPlugin());
config.plugins.push(new copyWebpack([{ from: './stimulsoft', to: config.output.path }], {}));

module.exports = config;