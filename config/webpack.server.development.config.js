var Path = require('path'),
    MFS = require('memory-fs'),
    KoaServerHttpProxy = require('koa-server-http-proxy'),
    Webpack = require('webpack'),
    WebpackDevMiddleware = require('koa-webpack-dev-middleware'),
    WebpackHotMiddleware = require('koa-webpack-hot-middleware'),
    Convert = require('koa-convert'),
    clientConfig = require('./webpack.client.config.js'),
    serverConfig = require('./webpack.server.config.js'),
    readFileHandler = (fs, file) => fs.readFileSync(Path.join(clientConfig.output.path, file), 'utf-8');

module.exports = function developmentServerHandler(app, template, callback) {
    let serverBundle = null,
        clientManifest = null,
        update = () => {
            if (serverBundle && clientManifest) {
                callback(serverBundle, {
                    template,
                    clientManifest
                });
            }
        };

    // 初始化相关配置参数 by client
    clientConfig.plugins.pop();
    clientConfig.mode = 'development';
    clientConfig.entry.client = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=3000&reload=true', clientConfig.entry.client];
    clientConfig.output.filename = '[name].js';
    clientConfig.plugins.push(new Webpack.HotModuleReplacementPlugin(), new Webpack.NoEmitOnErrorsPlugin());

    // webpack config
    const clientCompiler = Webpack(clientConfig);
    // dev middleware
    const devMiddleware = WebpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true,
            modules: false
        }
    });
    // proxy
    app.use(
        KoaServerHttpProxy('/api/work/read', {
            target: 'http://127.0.0.1:8080',
            pathRewrite: {
                // => http://127.0.0.1:8080/work/read
                '^/api': '/'
            },
            changeOrigin: true
        })
    );

    app.use(Convert(devMiddleware));
    // hot update
    clientCompiler.plugin('done', (stats) => {
        stats = stats.toJson();
        stats.errors.forEach((err) => console.error(err));
        stats.warnings.forEach((err) => console.warn(err));
        if (stats.errors.length) return;

        clientManifest = JSON.parse(readFileHandler(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json'));
        update();

        console.log('\n> client-building ... is run');
    });
    // hot middleware
    app.use(Convert(WebpackHotMiddleware(clientCompiler)));

    // 初始化相关配置参数 by server
    serverConfig.mode = 'development';
    serverConfig.devtool = 'source-map';
    serverConfig.optimization = {
        splitChunks: false
    };

    const serverCompiler = Webpack(serverConfig);
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err;
        stats = stats.toJson();
        if (stats.errors.length) return;

        serverBundle = JSON.parse(readFileHandler(mfs, 'vue-ssr-server-bundle.json'));
        update();

        console.log('\n> server-building ... is run');
    });

    devMiddleware.waitUntilValid(() => {
        console.log('\n> Listening at working ...');
    });
};
