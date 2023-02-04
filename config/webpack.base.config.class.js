var MiniCssExtractPlugin = require('mini-css-extract-plugin');

class BaseConfig {
    constructor(options) {
        this.publicFrontPath = options && options.publicFrontPath ? options.publicFrontPath : '';
        this.outFrontPath = options && options.outFrontPath ? options.outFrontPath : 'res/';
        this.fileFrontPath = options && options.fileFrontPath ? options.fileFrontPath : this.outFrontPath;
        this.mode = options && options.mode ? 'development' : 'production';
        this.pattern = options && options.pattern ? options.pattern : 'client';
        this.versionNumber = 'v1';
    }

    buildModuleRulesOperation() {
        let vueLoaderObject = {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            jsLoaderObject = {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            cssUseObject = null,
            lessUseObject = null,
            scssAndSassUseObject = null,
            rules = null;

        if (this.mode == 'production') {
            if (this.pattern == 'client') {
                cssUseObject = [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader'
                ];
                lessUseObject = [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    'less-loader'
                ];
                scssAndSassUseObject = [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ];
            } else {
                cssUseObject = [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader'
                ];
                lessUseObject = [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    'less-loader'
                ];
                scssAndSassUseObject = [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ];
            }

            vueLoaderObject.options = {
                extractCSS: true
            };
        } else {
            cssUseObject = [
                'vue-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                },
                'postcss-loader'
            ];
            lessUseObject = [
                'vue-style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'less-loader'
            ];
            scssAndSassUseObject = [
                'vue-style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ];
        }

        rules = [
            vueLoaderObject,
            jsLoaderObject,
            {
                test: /\.worker\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'worker-loader'
                }
            },
            {
                test: /\.css$/,
                use: cssUseObject
            },
            {
                test: /\.less$/,
                use: lessUseObject
            },
            {
                test: /\.(sc|sa)ss$/,
                use: scssAndSassUseObject
            },
            {
                test: /\.(gif|jpg|jpeg|png|mp4|webm|mp3|ogg|flac|aac)$/i,
                loader: 'url-loader',
                options: {
                    // 当文件大小小于 limit byte 时会把图片转换为 base64 编码，否则返回普通的图片
                    // limit: 1024 * 3,
                    limit: 1,
                    name: '[name]-[hash:8].[ext]',
                    outputPath: this.fileFrontPath + 'media/',
                    publicPath: this.publicFrontPath + this.fileFrontPath + 'media/'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[hash:8].[ext]',
                    outputPath: this.fileFrontPath + 'fonts/',
                    publicPath: this.publicFrontPath + this.fileFrontPath + 'fonts/'
                }
            }
        ];

        // console.log(rules);

        return rules;
    }
}

module.exports = BaseConfig;
