import Vue from 'vue';
import VueX from 'vuex';

import user from './modules/user.js';
import communal from './modules/communal.js';

Vue.use(VueX);

function createStore() {
    var store = new VueX.Store({
        modules: {
            user,
            communal
        },
        strict: false,
        plugins: []
    });

    if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
        // 浏览器端
        store.replaceState(window.__INITIAL_STATE__);
    } else {
        // 服务器端
    }

    return store;
}

export default createStore;
