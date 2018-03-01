const path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: './src/app.js',
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
      // Defining variables to pass to app.js
      new webpack.DefinePlugin({
        "fare" : false,
        "book": false,
        "saveit" : false,
        "exercises" : false,
        "turtle" : false,
        "robot" : true,
        // Insert the server API endpoint
        "postUrl" : JSON.stringify("xxx.xxx.xxx.xxx/python-online-server/api/post_file")
      }),
    ],
};

