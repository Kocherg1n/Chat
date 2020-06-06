const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        open: true
    },
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            { test: /\.hbs$/, loader: "handlebars-loader" },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img'
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.hbs',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '/style/[name].css',
        })
    ]
};
