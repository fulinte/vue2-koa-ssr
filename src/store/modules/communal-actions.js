import { Utils, $axios } from '../multiplex/actions.js';

var actions = {
    async asyncRead() {
        let response = await $axios.asyncRequestInterface('/test-api/one-data', {});

        if (response.state) {
            // 成功的处理
        } else {
            // 失败的处理
        }

        return response.state;
    },
    readDataset() {
        return [];
    }
};

export default actions;
