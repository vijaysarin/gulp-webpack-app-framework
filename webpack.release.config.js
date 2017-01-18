var webpack = require("webpack");
var path = require("path");

var config = {
    debug: false,
    watch: false,
    cache: false,
    entry: {
        app: ["./app/init.js"],
        vendor: ["./app/vendor.js"]
    },
    output: {
        path: path.join(__dirname, 'dist/scripts'),
        filename: 'app.min.js',
        publicPath: '/scripts/'
    },
    resolve: {
        modulesDirectories: ["node_modules", "bower_components"],
        alias: {
            moment: "moment/moment.js",
            nvd3: path.join(__dirname, "/bower_components/nvd3/build/nv.d3.js"),
            jqueryui: path.join(__dirname, "/bower_components/jQRangeSlider/jquery-ui.min.js"),
            jQRangeSlider: path.join(__dirname, "/bower_components/jQRangeSlider/jQAllRangeSliders-withRuler-min.js")
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.min.js", Infinity),
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|ko|ja|zh-cn)$/)
    ],
    module: {
        noParse: [],
        loaders: [
            {
                test: /\.js$/,
                exclude: ['/node_modules/', '/bower_components/'],
                loader: 'ng-annotate'
            },
            {
                test: /\.html$/,
                loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './app')) + '/!html'
            }, 
            {
                test: /\.png$/,
                loader: "url-loader",
                query: {
                    mimetype: "image/png"
                }
            }, 
            {
                test: /\.gif$/,
                loader: "url-loader",
                query: {
                    mimetype: "image/gif"
                }
            },
            {
                test: /\.svg/, 
                loader: 'svg-url-loader'
            }
        ]
    }
};

module.exports = config;
