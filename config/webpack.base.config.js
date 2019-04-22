const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, '../');


module.exports = env => {
    const { PLATFORM, VERSION } = env;
    return merge([
        {
            entry: {
                main: ['@babel/polyfill', APP_DIR + "/src/index.js"]
            },
            output: {
                path: path.resolve(__dirname, '../dist'),
                filename: '[name].bundle.js',
            },
            resolve: {
                modules: ['node_modules', 'src'],
                extensions: ['.js', '.jsx'],
              },
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                            'css-loader',
                            'sass-loader'
                        ]
                    },
                    {
                        test: /\.svg$/,
                        loader: 'svg-inline-loader'
                    }
                ]
            },

            plugins: [
                new webpack.HashedModuleIdsPlugin(),
                new HtmlWebpackPlugin({
                    template: './public/index.html',
                    filename: './index.html'
                }),
                new webpack.DefinePlugin({
                    'process.env.VERSION': JSON.stringify(env.VERSION),
                    'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
                }),
                new CopyWebpackPlugin([{ from: 'public/images' }]),
            ],
        }
    ])
};