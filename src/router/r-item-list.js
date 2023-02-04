let routes = [
    {
        name: 'HomePage',
        path: '/',
        meta: {
            title: 'Merx Webáruház',
            keywords: '',
            description: '',
            modes: 'static'
        },
        components: {
            default: () => import('@views/home/default.vue')
        }
    },
    {
        name: 'PageNotFount-404',
        path: '/404.html',
        meta: {
            title: '404 : Is Nothing',
            keywords: '',
            description: '',
            modes: 'static'
        },
        components: {
            default: () => import('@views/generic/404.vue')
        }
    },
    {
        name: 'PageRuntimeError-500',
        path: '/500.html',
        meta: {
            title: '500 : Runtime Error',
            keywords: '',
            description: '',
            modes: 'static'
        },
        components: {
            default: () => import('@views/generic/500.vue')
        }
    },
    {
        path: '*',
        redirect: '/404.html'
    }
];

export default routes;
