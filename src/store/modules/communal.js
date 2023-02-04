import actions from './communal-actions.js';

export default {
    namespaced: true,
    state: () => ({
        clientType: '',
        indexesMapping: {},
        navigationIndexes: [],
        treeNavigationIndexes: [],
        pageHeadMeta: {
            title: '',
            keywords: '',
            description: ''
        },
        scrollEvent: {
            isBottom: 0,
            bottomThreshold: 600,
            navigatorDeformation: false,
            navigatorDeformationThreshold: 100
        },
        depository: null
    }),
    getters: {},
    mutations: {
        initializeIndexesDataset(state, indexes) {
            state.indexesMapping = indexes.mapping;
            state.navigationIndexes = indexes.navigation;
        },
        initializePageHeadMeta(state) {
            state.pageHeadMeta.title = '';
            state.pageHeadMeta.keywords = '';
            state.pageHeadMeta.description = '';
        }
    },
    actions
};
