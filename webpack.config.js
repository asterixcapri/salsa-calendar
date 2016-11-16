var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        "./src/SalsaCalendar.js",
        //"./src/css/salsa-calendar.less"
    ],
    output: {
        path: __dirname,
        filename: "build/salsa-calendar.js",
        libraryTarget: "var",
        library: "SalsaCalendar"
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
        new ExtractTextPlugin("build/salsa-calendar.css", {
            //allChunks: true
        })
    ]
};
