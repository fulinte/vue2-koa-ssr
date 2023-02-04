import Vue from 'vue';
// 导入 router 相关操作
import RouterClass from './router/main.js';
// 导入 store 相关操作
import CreateVueXStore from './store/main.js';
// Axios Normal
import NormalAxios from './plugins/axios/normal.js';
// 导入 app.vue
import App from './app.vue';
// vue-cookies
import VueCookies from 'vue-cookies';
// 定义的 util 工具
import UtilsClass from './plugins/utils.js';
// 引入 Message 组件
import 'vue-m-message/dist/index.css';
import Message from 'vue-m-message';
// 引入 moment 时间操作库
import Moment from 'moment';
// i18n
import I18n from './plugins/i18n/index.js';

const Store = CreateVueXStore();
const Utils = new UtilsClass(Store);
const Axios = new NormalAxios(
    Utils.requestInterfaceURL,
    Utils.requestInterfaceTimeOut,
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

Vue.use(VueCookies);
Vue.use(Message);

Vue.prototype.$utils = Utils;
Vue.prototype.$moment = Moment;
Vue.prototype.$axios = Axios;

Moment.transformationTimeStampFormat = (timeStamp, format = 'hh:mm MM/DD/YYYY') => {
    return Moment.unix(timeStamp).format(format);
};

function createApp() {
    var classRouter = new RouterClass(Store, Axios, Utils),
        refAppJs = new Vue({
            store: Store,
            router: classRouter.RouterMainstay,
            i18n: I18n,
            render: (h) => h(App)
        });

    return {
        refClassRouter: classRouter,
        refAppVue: App,
        refAppJs,
        refStore: Store,
        refRouter: classRouter.RouterMainstay,
        refAxios: Axios,
        refUtils: Utils
    };
}

export default createApp;
