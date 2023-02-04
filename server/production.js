const Fs = require('fs');
const Path = require('path');
const LRU = require('lru-cache');
const Koa = require('koa');
const Router = require('koa-router');
const StaticServer = require('koa-static');
const Compress = require('koa-compress');
const { createBundleRenderer } = require('vue-server-renderer');
const serverPort = 8001;

const serverBundle = require(Path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(Path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'));
const template = Fs.readFileSync(Path.resolve(__dirname, '../dist/server.tpl'), 'utf-8');

const renderer = createBundleRenderer(serverBundle, {
    // 组件缓存
    cache: new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 30
    }),
    runInNewContext: false,
    template: template,
    clientManifest: clientManifest
});

const renderToStringHandler = (c, r) => {
    // 页面缓存处理，可在这里实现
    return new Promise((resolve, reject) => {
        r.renderToString(
            {
                url: c.url,
                userAgent: c.header['user-agent']
            },
            (err, html) => {
                err ? reject(err) : resolve(html);
            }
        );
    });
};

// 后端 Server
var backendApp = new Koa(),
    backendRouter = new Router();

backendApp.use(Compress({
    // 压缩处理的过滤器
    // filter(content_type) {
    //     return /(text|javascript)/i.test(content_type)
    // },
    // 压缩器的阈值门限
    threshold: 2048,
    gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: true
}));

backendRouter.get('*', async (context) => {
    context.compress = true;

    try {
        context.body = await renderToStringHandler(context, renderer);
    } catch (error) {
        let code = error ? Number(error.code) : '';

        switch (code) {
            case 404:
                context.status = 404;
                context.body = Fs.readFileSync(Path.resolve(__dirname, '../dist/404.tpl'), 'utf-8');
                break;
            default:
                context.status = 500;
                context.body = Fs.readFileSync(Path.resolve(__dirname, '../dist/500.tpl'), 'utf-8');
                break;
        }
        
        // 有需要的话，在这里实现对于错误的存储处理
    }
});

backendApp.use(StaticServer(Path.resolve(__dirname, '../dist')));
backendApp.use(backendRouter.routes()).use(backendRouter.allowedMethods());
backendApp.listen(serverPort, () => {
    console.log(`'\n> Use Server Port：${serverPort}\n'`);
});
