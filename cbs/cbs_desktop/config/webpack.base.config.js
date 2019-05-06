const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = env => {
    const { PLATFORM, VERSION } = env;

    return merge([
        {
            entry: {    
                "main":  path.resolve(__dirname,'../src/index.js')     
            },
            output: {
                path: path.resolve(__dirname, '../build'),
                filename: '[name].bundle.js' 
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
                        test: /\.json$/,
                        loader: 'json'
                    },{
                        test: /\.css$/,
                        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
                    },{
                        test: /\.less$/,
                        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
                    },{
                        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                        loader: 'url-loader?limit=100'
                    }
                ]
            },
            plugins: [
                new webpack.HashedModuleIdsPlugin(),
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    filename: 'index.html'
                }),
                new webpack.DefinePlugin({
                    'process.env.VERSION': JSON.stringify(VERSION),
                    'process.env.PLATFORM': JSON.stringify(PLATFORM)
                }),
                new CopyWebpackPlugin([{ from: 'public/images' }])
            ],
        }
    ])
};
























