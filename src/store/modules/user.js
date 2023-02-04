import actions from './user-actions.js';

export default {
    namespaced: true,
    state: () => ({
        uid: '',
        account: '',
        nickname: '',
        loginState: false,
        subscribeState: false,
        shopCart: {
            visible: false,
            loading: false,
            listing: []
        }
    }),
    getters: {},
    mutations: {
        initializeShopCartDataset(state) {
            state.shopCart.visible = false;
            state.shopCart.loading = false;
            state.shopCart.listing = [];
        }
    },
    actions
};
