// 定义的 util 工具
import UtilsClass from '../../plugins/utils.js';
// 引入 Message 组件
import Message from 'vue-m-message';
// 类的入参 baseURL, timeout, methodTips
import NormalAxios from '../../plugins/axios/normal.js';

// 工具库引用
const Utils = new UtilsClass();
const $axios = new NormalAxios(
    Utils.interfaceURL,
    Utils.requestTimeOut,
    (type, message) => {
        switch (type) {
            case 'info':
                Message.info(message);
                break;
            case 'success':
                Message.success(message);
                break;
            case 'warning':
                Message.warning(message);
                break;
            case 'loading':
                Message.loading(message);
                break;
            case 'error':
            case 'fail':
            default:
                Message.error(message);
                break;
        }
    },
    Utils
);

export { Utils, $axios };
