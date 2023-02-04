import createApp from './app.js';

const { refClassRouter, refAppJs, refStore, refRouter, refAxios } = createApp();

refClassRouter
    .asyncReadIndexesDatasetWithCache()
    .then((unprocessedIndexes) => {
        // 操作返回的 indexes
        var indexes = refClassRouter.structureIndexesDataset(unprocessedIndexes);
        refClassRouter.initialRouterRequisiteProcess(refRouter, indexes.navigation);
        refStore.commit('communal/initializeIndexesDataset', indexes);
        refRouter.onReady(() => {
            refAppJs.$mount('#app');
            // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve
            refRouter.beforeResolve((to, from, next) => {
                if (from.name) {
                    let toMatched = refRouter.getMatchedComponents(to);
                    Promise.all(
                        toMatched.map((c) => {
                            if (c.asyncPageInitializationHandling) {
                                return c.asyncPageInitializationHandling({
                                    refStore,
                                    refAxios,
                                    refRouter,
                                    refRoute: to
                                });
                            }
                        })
                    )
                        .then(() => {
                            next();
                        })
                        .catch((err) => {
                            console.log('entry-client-router-before-resolve', err);
                            // 跳到 500 页
                            next('/500.html');
                        });
                } else {
                    next();
                }
            });
        });
    })
    .catch((frs) => {
        console.log('inlet-client-router-catch', frs);
    });
