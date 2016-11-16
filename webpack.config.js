var process = require('process');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var libraryName = 'SalsaCalendar';
var outputFile = (process.argv.indexOf('-p') !== -1) ? libraryName + '.min' : libraryName;

module.exports = {
    entry: [
        "./src/SalsaCalendar.js"
    ],
    output: {
        path: __dirname + '/build',
        filename: outputFile + '.js',
        library: "SalsaCalendar",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test:/\.(png|jpe?g|gif)$/,
                loader: 'url-loader?name=assets/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(outputFile + '.css')
    ]
};
