var path = require('path');
var webpack = require('webpack');
var root = path.resolve(__dirname);

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        sourcePrefix: ''
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|html|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.glsl$/,
                include: path.resolve(root, 'src/shaders'),
                loader: 'webpack-glsl-loader'
            }
        ]
    },
    resolve: {
        alias: {
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: 'modules',
            minChunks: function(module) {
                var context = module.context;
                if (!context) return false;
                return context.includes('node_modules');
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // this chunk is needed so the modules bundle doesn't get rebuilt anytime a file changes
            name: 'manifest'
        })
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    ])
}