import AxiosUtils from './utils.js';
import AxiosExample from './example.js';

class NormalAxios extends AxiosUtils {
    constructor(baseURL = '', timeout = '', methodMessage, Utils) {
        super(methodMessage);
        // 实例化 axios
        this.Axios = AxiosExample(baseURL, timeout);
        // 关联 utils 实例
        this.Utils = Utils;
    }

    async asyncRequestInterface(url, params, mode = 'get', options = { autoPrompt: true, openCache: false }) {
        var unknownResponse = {
                state: false,
                respond: 'fail'
            },
            hasKey = '';

        if (options?.openCache) {
            // 生成访问标识
            hasKey = this.Utils.Md5(url + JSON.stringify(params));
            // 有缓存直接返回
            if (this.Utils.LRUCache.cached && this.Utils.LRUCache.cached.has(hasKey)) {
                return this.Utils.LRUCache.cached.get(hasKey);
            }
        }

        let asyncAxiosRequest = (url, params, mode) => {
                if (mode == 'put') {
                    return this.Axios.put(url, params);
                } else if (mode == 'post') {
                    return this.Axios.post(url, params);
                } else if (mode == 'delete') {
                    return this.Axios.delete(url, {
                        data: params
                    });
                } else {
                    return this.Axios.get(url, { params });
                }
            },
            response = null;

        try {
            response = await asyncAxiosRequest(url, params, mode);
        } catch (error) {
            response = {
                state: false
            };
        }

        if (response?.respond == 'success') {
            response.state = true;
            if (options?.openCache && this.Utils.LRUCache.cached) this.Utils.LRUCache.cached.set(hasKey, response);

            return response;
        } else {
            if (options?.autoPrompt) {
                if (typeof window !== 'undefined') this.defaultAbnormalSituationHandling(response);
            } else {
                return response;
            }
        }

        return unknownResponse;
    }

    // return { 终止方法, Promise 对象 }
    requestInterfaceOfCancelToken(url, params, mode = 'get', options = { autoPrompt: true, openCache: false }) {
        var unknownResponse = {
                state: false,
                respond: 'fail'
            },
            hasKey = '';

        if (options?.openCache) {
            hasKey = this.Utils.Md5(url + JSON.stringify(params));
            // 有缓存直接返回
            if (this.Utils.LRUCache.cached && this.Utils.LRUCache.cached.has(hasKey)) {
                return {
                    holder: {
                        cancel: () => {}
                    },
                    asyncRun: async () => {
                        return this.Utils.LRUCache.cached.get(hasKey);
                    }
                };
            }
        }

        let cancelSource = this.Axios.cancelToken.source(),
            asyncAxiosRequest = (url, params, mode) => {
                if (mode == 'put') {
                    return this.Axios.put(url, params, {
                        cancelToken: cancelSource.token
                    });
                } else if (mode == 'post') {
                    return this.Axios.post(url, params, {
                        cancelToken: cancelSource.token
                    });
                } else if (mode == 'delete') {
                    return this.Axios.delete(url, {
                        data: params,
                        cancelToken: cancelSource.token
                    });
                } else {
                    return this.Axios.get(url, { params, cancelToken: cancelSource.token });
                }
            },
            run = async () => {
                let response = null;

                try {
                    response = await asyncAxiosRequest(url, params, mode);
                } catch (error) {
                    response = {
                        state: false
                    };
                }

                if (this.Axios.isCancel(response)) {
                    this.defaultAbnormalSituationHandling({
                        ...response,
                        command: 'request_cancel'
                    });

                    unknownResponse.command = 'request_cancel';
                } else if (response?.respond == 'success') {
                    response.state = true;
                    if (options?.openCache && this.Utils.LRUCache.cached) this.Utils.LRUCache.cached.set(hasKey, response);

                    return response;
                } else {
                    if (options?.autoPrompt) {
                        this.defaultAbnormalSituationHandling(response);
                    } else {
                        return response;
                    }
                }

                return unknownResponse;
            };

        return {
            holder: cancelSource,
            asyncRun: run
        };
    }
}

export default NormalAxios;
