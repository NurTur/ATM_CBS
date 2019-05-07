const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = env => {
    const { PLATFORM, VERSION } = env;
    return merge([
        {
            entry: {
                main: path.resolve(__dirname, '../src/index.js')
            },
            output: {
                path: path.resolve(__dirname, '../build'),
                filename: '[name].bundle.js'
            },
            resolve: {
                alias: {
                    Public: path.resolve(__dirname, '../public'),
                    Components: path.resolve(__dirname, '../src/components/'),
                    Styles: path.resolve(__dirname, '../src/styles/'),
                }
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
                        test: /\.css$/,
                        use: [
                            PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                            'css-loader']
                    },
                    {
                        test: /\.less$/,
                        use: [
                            PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                            'css-loader', 'less-loader']
                    },
                    {
                        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
                        use: `file-loader`
                    },
                    {
                        test: /\.(jpg|png|gif)$/,
                        use: [
                            `file-loader`,
                            {
                                loader: `image-webpack-loader`
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    filename: './index.html'
                }),
                new webpack.DefinePlugin({
                    'process.env.VERSION': JSON.stringify(env.VERSION),
                    'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
                }),
                new CopyWebpackPlugin([{ from: 'public' }]),
            ],
        }
    ])
};


























