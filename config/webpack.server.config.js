var Path = require('path'),
    NodeExternals = require('webpack-node-externals'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    VueSSRServerPlugin = require('vue-server-renderer/server-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin'),
    BaseConfigClass = require('./webpack.base.config.class.js'),
    baseConfig = new BaseConfigClass({
        publicFrontPath: '/',
        pattern: 'server'
    });

module.exports = {
    mode: 'production',
    target: 'node',
    externals: [
        NodeExternals({
            allowlist: [/\.(css|less|scss|sass)$/i]
        })
    ],
    entry: {
        server: Path.resolve(__dirname, '../src/inlet-server.js')
    },
    output: {
        path: Path.resolve(__dirname, '../dist'),
        publicPath: baseConfig.publicFrontPath,
        filename: baseConfig.outFrontPath + `[name].${baseConfig.versionNumber}.js`,
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: baseConfig.buildModuleRulesOperation()
    },
    plugins: [
        new VueLoaderPlugin(),
        new VueSSRServerPlugin(),
        new HtmlWebpackPlugin({
            template: Path.resolve(__dirname, '../template/server.html'),
            filename: 'server.tpl',
            excludeChunks: ['server'],
            minify: {
                removeComets: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            }
        }),
        new ExtractTextPlugin({
            filename: baseConfig.outFrontPath + `[name].${baseConfig.versionNumber}.css`
        }),
        new OptimizeCssPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ],
    optimization: {
        splitChunks: false
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            vue: Path.resolve(__dirname, '../node_modules/vue/dist/vue.min.js'),
            '@src': Path.resolve('src'),
            '@components': Path.resolve('src/components'),
            '@plugins': Path.resolve('src/plugins'),
            '@static': Path.resolve('src/static'),
            '@views': Path.resolve('src/views'),
            '@vender': Path.resolve('vender')
        }
    }
};
