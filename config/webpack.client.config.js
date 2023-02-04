var Path = require('path'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    VueSSRClientPlugin = require('vue-server-renderer/client-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    BaseConfigClass = require('./webpack.base.config.class.js'),
    baseConfig = new BaseConfigClass({
        publicFrontPath: '/'
    });

module.exports = {
    mode: 'production',
    entry: {
        client: Path.resolve(__dirname, '../src/inlet-client.js')
    },
    output: {
        path: Path.resolve(__dirname, '../dist'),
        publicPath: baseConfig.publicFrontPath,
        filename: baseConfig.outFrontPath + `[name].${baseConfig.versionNumber}.js`
    },
    module: {
        rules: baseConfig.buildModuleRulesOperation()
    },
    plugins: [
        new VueLoaderPlugin(),
        new VueSSRClientPlugin(),
        new HtmlWebpackPlugin({
            template: Path.resolve(__dirname, '../template/client.html'),
            filename: 'client.tpl',
            minify: {
                removeComets: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
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
        }),
        new CopyWebpackPlugin([
            {
                from: Path.resolve(__dirname, '../template/favicon.ico'),
                to: Path.resolve(__dirname, '../dist/')
            },
            {
                from: Path.resolve(__dirname, '../template/404.html'),
                to: Path.resolve(__dirname, '../dist/404.tpl')
            },
            {
                from: Path.resolve(__dirname, '../template/500.html'),
                to: Path.resolve(__dirname, '../dist/500.tpl')
            }
        ]),
        new CleanWebpackPlugin(['*'], {
            root: Path.resolve(__dirname, '../dist'),
            verbose: true,
            dry: false
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'initial',
            automaticNameDelimiter: '.',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /node_modules[\\/](vue|vue-router|vuex|axios|nprogress)[\\/]/,
                    priority: 9
                },
                libs: {
                    name: 'libs',
                    minChunks: 9,
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        }
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
