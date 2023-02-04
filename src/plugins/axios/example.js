import _Axios from 'axios';
import _Qs from 'qs';

const defaultTimeout = 120 * 1000;

function AxiosObject(baseURL = '', timeout = '') {
    var Axios = _Axios.create({
        baseURL,
        timeout: timeout || defaultTimeout
    });

    Axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
    Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    Axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    Axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    Axios.all = _Axios.all;
    Axios.spread = _Axios.spread;
    Axios.cancelToken = _Axios.CancelToken;
    Axios.isCancel = _Axios.isCancel;

    Axios.interceptors.request.use(
        (config) => {
            // console.log('axios-interceptors-request: ', response);

            switch (config.method) {
                case 'post':
                case 'put':
                case 'delete':
                    if (typeof config.data == 'string') {
                        config.headers[config.method]['Content-Type'] = 'application/json;charset=utf-8';
                    } else {
                        config.data = _Qs.stringify(config.data);
                    }
                    break;
            }

            return config;
        },
        (error) => {
            console.log('axios-request-error', error);

            return Promise.reject({
                respond: 'error',
                location: 'axios-interceptors-request.error',
                result: JSON.stringify(error)
            });
        }
    );

    Axios.interceptors.response.use(
        (response) => {
            // console.log('axios-interceptors-response: ', response);

            return response.data;
        },
        (error) => {
            console.log('axios-response-error: ', error);

            return Promise.reject({
                respond: 'error',
                location: 'axios-interceptors-response.error',
                result: JSON.stringify(error)
            });
        }
    );

    return Axios;
}

export default AxiosObject;
