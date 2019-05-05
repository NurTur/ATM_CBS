var webpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpackConfig = require("./webpack.dev.config");

webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(webpackConfig);
var server = new webpackDevServer(compiler, {
    hot: true,
    contentBase: "build/",
    proxy: {
        "/api": "http://localhost:5000",
        "/file": "http://localhost:5000"
    },
    historyApiFallback: {
        index: 'index.html'
    }
});

server.listen(8080, "localhost", function() {});