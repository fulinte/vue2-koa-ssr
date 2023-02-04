// 标题操作（涉及服务端seo）
// 先读取 vuex 里的配置，为空读取路由里的配置
function getVueElementObjectHandler(vm, type = '') {
    // 每个页面，通过 asyncPageInitializationHandling 读取 seo 信息，并赋值到 communal.pageHeadMeta 里
    var pageHeadMeta = vm.$store.state.communal.pageHeadMeta,
        routePageMeta = vm.$route.meta,
        element = {
            title: pageHeadMeta?.title || routePageMeta?.title || '',
            keywords: pageHeadMeta?.keywords || routePageMeta?.keywords || '',
            description: pageHeadMeta?.description || routePageMeta?.description || ''
        };

    if (type == 'server') {
        element.Utils = vm.$utils;
    } else {
        element.setPageTitle = vm.$router.setPageTitle;
    }

    return element;
}

const mxiPageHabitualInitialize = {
    created() {
        // console.log('page mxi is run by created');

        if (typeof window === 'undefined') {
            let { title, keywords, description, Utils } = getVueElementObjectHandler(this, 'server');

            // 服务端
            this.$ssrContext.headTitle = title;
            this.$ssrContext.headMetaKeywords = keywords || '';
            this.$ssrContext.headMetaDescription = description || '';
        } else {
            let { title, keywords, description, setPageTitle } = getVueElementObjectHandler(this, 'client');

            // 浏览器端
            setPageTitle({
                title,
                keywords,
                description
            });
        }
    }
};

export { mxiPageHabitualInitialize };
