import { Utils, $axios } from '../multiplex/actions.js';

var actions = {
    // 测试用户权限（登陆状态）及更新用户状态的操作
    // { commit, state, getters }
    async asyncCheckIdentity({ state }, params) {
        let resResponse = false;

        if (params) {
            Utils.ValueCopyHandler(state, params);
            sessionStorage.setItem('UserInfo', JSON.stringify(state));
            resResponse = true;
        } else {
            // 读取的缓存
            let storage = Utils.ReadSessionStorage('UserInfo');
            if (storage !== false) {
                Utils.ValueCopyHandler(state, storage);
                resResponse = true;
            } else {
                resResponse = false;
            }
        }

        return resResponse;
    },
    async asyncReqUserLoginOut() {
        let response = await $axios.asyncRequestInterface('/test-api/user-logout', {});

        if (response.state) {
            sessionStorage.clear();
            localStorage.clear();
        }

        return response.state;
    }
};

export default actions;
