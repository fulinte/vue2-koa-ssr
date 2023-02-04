const Fs = require('fs');
const Path = require('path');
const LRU = require('lru-cache');
const Koa = require('koa');
const Router = require('koa-router');
const StaticServer = require('koa-static');
const { createBundleRenderer } = require('vue-server-renderer');
const serverPort = 9001;

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
    backendRouter = new Router(),
    template = Fs.readFileSync(Path.resolve(__dirname, '../template/server.html'), 'utf-8'),
    renderer = null;

require('../config/webpack.server.development.config.js')(backendApp, template, (bundle, options) => {
    try {
        renderer = createBundleRenderer(
            bundle,
            Object.assign(options, {
                // 组件缓存
                cache: new LRU({
                    max: 1000,
                    maxAge: 1000 * 1 * 1
                }),
                runInNewContext: false
            })
        );
    } catch (e) {
        console.log('\n> Bundle error：\n', e);
    }
});

backendRouter.get('*', async (context) => {
    try {
        context.body = await renderToStringHandler(context, renderer);
    } catch (error) {
        let code = error ? error.code : '';

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

        console.log(`\n>URL=${context.url} Error-start：\n`);
        console.log(error);
        console.log(context);
        console.log('\n> Error-End\n');
    }
});

backendApp.use(StaticServer(Path.resolve(__dirname, '../dist')));
backendApp.use(backendRouter.routes()).use(backendRouter.allowedMethods());
backendApp.listen(serverPort, () => {
    console.log(`'\n> Development Server Port：${serverPort}\n'`);
});
