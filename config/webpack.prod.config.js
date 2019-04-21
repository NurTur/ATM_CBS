/* eslint-disable */
const merge = require('webpack-merge');
// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// Configs
const baseConfig = require('./webpack.base.config');

const prodConfiguration = env => {
    return merge([
        {
            optimization: {
                minimizer: [new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                }),],
            },
            plugins: [
                new MiniCssExtractPlugin(),
                new OptimizeCssAssetsPlugin(),
                new Visualizer({ filename: './statistics.html' })
            ],
        },
    ]);
}

module.exports = env => {
    return merge(baseConfig(env), prodConfiguration(env));
}