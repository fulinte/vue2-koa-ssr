import Vue from 'vue';
import VueRouter from 'vue-router';
import routeItemListing from './r-item-list.js';
// 引入 Nprogress 库
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

Vue.use(VueRouter);
NProgress.configure({
    easing: 'ease',
    speed: 500,
    showSpinner: true,
    trickleSpeed: 200,
    minimum: 0.3
});

class Router {
    constructor(store, axios, utils) {
        // 导出的对象
        // mode: history | hash
        this.RouterMainstay = new VueRouter({
            mode: 'history',
            // fallback: false,
            // scrollBehavior: () => ({ y: 0 }),
            routes: []
        });

        // 引用状态管理器 vuex store
        this.RefStore = store;
        this.RefAxios = axios;
        this.RefUtils = utils;

        this.LoaderProgress = NProgress;
        this.RouterMainstay.setPageTitle = this.setPageTitle;

        this.normalInitializeRouterMainstay();
    }

    // 动态添加路由时，会多次执行这里的钩子
    normalInitializeRouterMainstay() {
        // 路由前置钩子
        this.RouterMainstay.beforeEach((to, from, next) => {
            if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
                // 浏览器环境操作
                // 调用进度条
                this.LoaderProgress.start();
            } else {
                // 服务端环境操作
            }

            next();
        });

        // 路由后置钩子
        this.RouterMainstay.afterEach((to, from) => {
            // 浏览器环境操作
            if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
                // 关闭进度条
                this.LoaderProgress.done();
                // 定位滚动条
                window.scrollTo(0, 0);
            } else {
                // 服务端环境操作
            }
        });
    }
    setPageTitle({ title, keywords, description }) {
        document.title = title;
        document.querySelector('meta[name="keywords"]').setAttribute('content', keywords || '');
        document.querySelector('meta[name="description"]').setAttribute('content', description || '');
    }

    async asyncReadIndexesDatasetWithCache() {
        var serveCacheKey = 'UNPROCESSED_INDEXES',
            browserCacheKey = 'UnprocessedIndexes',
            cacheResult = false;

        // 服务器
        if (typeof window === 'undefined') {
            if (this.RefUtils.LRUCache.cached && this.RefUtils.LRUCache.cached.has(serveCacheKey)) {
                // console.log(`\n${new Date().getTime()}`, 'is cache');
                cacheResult = this.RefUtils.LRUCache.cached.get(serveCacheKey);
            }
        } else {
            // 浏览器
            cacheResult = this.RefUtils.ReadSessionStorage(browserCacheKey);
        }

        if (cacheResult !== false) {
            return cacheResult;
        } else {
            let { state, list } = await this.RefAxios.asyncRequestInterface('/interface/route-indexes', {}, 'get', {
                autoFailOpr: false
            });

            if (state) {
                // console.log(`\n${new Date().getTime()}`, 'is request');
                if (typeof window === 'undefined') {
                    this.RefUtils.LRUCache.cached.set(serveCacheKey, list);
                } else {
                    sessionStorage.setItem(browserCacheKey, JSON.stringify(list));
                }

                return list;
            } else {
                return [];
            }
        }
    }
    structureIndexesDataset(indexesList) {
        let idMapping = {},
            treeList = [];

        indexesList.forEach((item) => {
            let id = Number(item.id);
            idMapping[id] = item;
        });

        indexesList.forEach((item) => {
            let id = Number(item.pid),
                node = idMapping[id];

            if (node) {
                (node.subset || (node.subset = [])).push(item);
            } else {
                treeList.push(item);
            }
        });

        return {
            unprocessed: indexesList,
            mapping: idMapping,
            treeList
        };
    }
    initialRequisiteRouterProcess(ro, list) {
        try {
            // 远程获取的路由配置
            // for (let x of list) {
            //     let item = buildRouteItemObject(x);
            //     if (!item) continue;
            //     if (Array.isArray(item)) {
            //         for (let y of item) {
            //             ro.addRoute(y);
            //         }
            //     } else {
            //         ro.addRoute(item);
            //     }
            // }
            // 本地路由配置
            for (let x of routeItemListing) {
                if (x.path != '*') {
                    ro.addRoute(x);
                } else if (typeof window !== 'undefined') {
                    ro.addRoute(x);
                }
            }
        } catch (error) {
            console.log('initialRequisiteRouterProcess', error);
        }
    }
}

export default Router;
