import createApp from './app.js';

// 服务端入口初始化方法，需要返回一个 promise
export default (context) => {
    const { refClassRouter, refAppJs, refStore, refRouter, refAxios, refUtils } = createApp();
    // 服务端入口初始化方法，需要返回一个 promise
    return new Promise((resolve, reject) => {
        refClassRouter
            .asyncReadIndexesDatasetWithCache()
            .then((unprocessedIndexes) => {
                var indexes = refClassRouter.structureIndexesDataset(unprocessedIndexes);
                refClassRouter.initialRouterRequisiteProcess(refRouter, indexes.navigation);
                refStore.commit('communal/initializeIndexesDataset', indexes);
                refRouter.onReady(
                    (to) => {
                        let matchedComponents = refRouter.getMatchedComponents();
                        if (!matchedComponents.length) {
                            reject({
                                code: 404
                            });
                        } else {
                            refStore.state.communal.clientType = refUtils.CheckIsMobileClientType(context.userAgent) ? 'mobile' : 'pc';
                            if (refStore.state.communal.clientType == 'mobile') {
                                // 不同设备地址的跳转
                                reject({
                                    code: 'jump -> mobile url'
                                });
                            } else {
                                Promise.all(
                                    matchedComponents.map((component) => {
                                        if (component.asyncPageInitializationHandling) {
                                            // 返回组件的 Promise 方法
                                            return component.asyncPageInitializationHandling({
                                                refStore,
                                                refAxios,
                                                refRouter,
                                                refRoute: refRouter.currentRoute
                                            });
                                        }
                                    })
                                )
                                    .then(() => {
                                        // 将 store 的快照挂到 ssr 上下文上
                                        context.state = {
                                            user: {
                                                ...refStore.state.user
                                            },
                                            communal: {
                                                ...refStore.state.communal
                                            }
                                        };
                                        // 返回根组件
                                        resolve(refAppJs);
                                    })
                                    .catch((frs) => {
                                        console.log('inlet-server-matched-components', frs);
                                        reject({
                                            code: 500
                                        });
                                    });
                            }
                        }
                    },
                    (error) => {
                        console.log('inlet-server-initialization-router-on-ready', error);
                        reject({
                            code: 404
                        });
                    }
                );
                refRouter.push(context.url);
            })
            .catch((frs) => {
                console.log('inlet-server-read-indexes', err);
                reject({
                    code: 500
                });
            });
    });
};
