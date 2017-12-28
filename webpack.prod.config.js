// Versione di prod con le compressioni attive
const path = require('path');
var webpack = require("webpack");

module.exports = {
    devtool: 'source-map',
    entry: './src/fare_python.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            // In case you imported plugins individually, you must also require them here:
            Util: "exports-loader?Util!bootstrap/js/dist/util",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')        
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
                    output: {
                        comments: false
                    },
                    mangle: true,
                    sourcemap: false,
                    debug: false,
                    minimize: true,
                    compress: {
                        warnings: false,
                        screw_ie8: true,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true
                    }
        }),
        new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 

    ],
};

