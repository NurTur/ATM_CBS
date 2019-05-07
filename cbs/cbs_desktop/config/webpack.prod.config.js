/* eslint-disable */
const merge = require('webpack-merge');
// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require(`webpack-bundle-analyzer`).BundleAnalyzerPlugin;
// Configs
const baseConfig = require('./webpack.base.config');

const prodConfiguration = env => {
    return merge([
        {
            optimization: {
                minimizer: [
                    new UglifyJsPlugin({
                        cache: true,
                        parallel: true,
                        sourceMap: true
                    }),
                    new OptimizeCssAssetsPlugin({}),

                ],
                splitChunks: {
                    cacheGroups: {
                        commons: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            chunks: 'all'
                        }
                    }
                }

            },
            plugins: [
                new MiniCssExtractPlugin(),
                new BundleAnalyzerPlugin()
            ],
        },
    ]);
}

module.exports = env => {
    return merge(baseConfig(env), prodConfiguration(env));
}




