import LruCache from './lru-cache.js';
import MD5 from 'js-md5';

class Utils {
    // arrLoadSource
    constructor() {
        this.arrLoadSource = [];

        this.LRUCache = LruCache;
        this.Md5 = MD5;

        this.requestCache = false;
        this.requestInterfaceURL = '';
        this.requestInterfaceTimeOut = 120 * 1000;
        this.uploadInterfaceURL = '/upload/images';
        this.staticBeforeURLPath = 'https://cdn.domain.com';
        this.defaultURLSuffix = '.html';
    }

    // 浏览器的一些操作集成
    Browser() {
        return {
            // 语言
            language: (navigator.browserLanguage || navigator.language).toLowerCase(),
            // 运行在什么浏览器
            runTime: () => {
                let u = navigator.userAgent;
                return {
                    //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    wechat: u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
                };
            },
            // 获取 URL 上的参数
            getUrlParam: (name) => {
                let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
                let r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
        };
    }
    CheckIsMobileClientType(agent) {
        return agent ? !!agent.match(/AppleWebKit.*Mobile.*/) : false;
    }
    // 载入外部 js 或 css 资源
    // params => [] | {}
    // el => name, url, resolve, reject, mode
    LoadURLSourceHandle(params) {
        let loadSource = function (x) {
            if (this.arrLoadSource[x.name]) {
                x.resolve();
                return;
            }

            if (x.mode == 'script') {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = x.url;
                script.onload = x.resolve;
                script.onerror = x.reject;
                script.setAttribute('remove', x.name);
                document.head.appendChild(script);
                this.arrLoadSource[x.name] = script;
            } else {
                let style = document.createElement('link');
                style.rel = 'stylesheet';
                style.href = x.url;
                style.onload = x.resolve;
                style.onerror = x.reject;
                style.setAttribute('remove', x.name);
                document.head.appendChild(style);
                this.arrLoadSource[x.name] = style;
            }
        };

        if (params instanceof Array) {
            for (let x of params) {
                loadSource(x);
            }
        } else {
            loadSource(params);
        }
    }
    // 移徐载入的 js 或 css 资源
    RemoveURLSourceHandle(params) {
        let removeSource = function (x) {
            let element = document.getElementsByTagName(x);
            for (let i = 0; i < element.length; i++) {
                if (element[i] && element[i].getAttribute('remove')) {
                    element[i].parentNode.removeChild(element[i]);
                }
            }
        };

        if (!params) {
            for (let x of ['script', 'link']) {
                removeSource(x);
            }
        }
    }
    // 生成从 minNum 至 maxNum 的随机数
    RandomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
    // 生成浏览器唯一标识
    BuildCoreOnlyIdentification(domain) {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            txt = domain,
            bin2hex = (s) => {
                var i,
                    l,
                    o = '',
                    n;

                s += '';
                for (i = 0, l = s.length; i < l; i++) {
                    n = s.charCodeAt(i).toString(16);
                    o += n.length < 2 ? '0' + n : n;
                }

                return o;
            };

        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = 'tencent';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText(txt, 4, 17);

        let b64 = canvas.toDataURL().replace('data:image/png;base64,', ''),
            bin = atob(b64),
            crc = bin2hex(bin.slice(-16, -12));

        return crc;
    }
    // 字符串截取 包含对中文处理,str需截取字符串,start开始截取位置,n截取长度
    ChineseSubstr(str, start, n) {
        if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
            return str;
        }

        let len = 0,
            tmpStr = '';
        // 遍历字符串
        for (let i = start; i < str.length; i++) {
            if (/[\u4e00-\u9fa5]/.test(str[i])) {
                len += 2;
            } else {
                len += 1;
            }

            if (len > n) {
                break;
            } else {
                tmpStr += str[i];
            }
        }

        return tmpStr;
    }
    // 一维数组内容去重
    SimpleUniqueArrayValueHandler(arr) {
        return Array.from(new Set(arr));
    }
    // 深度克隆
    DeepClone(obj) {
        let objClone = Array.isArray(obj) ? [] : {};

        if (obj && typeof obj === 'object') {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if (obj[key] && typeof obj[key] === 'object') {
                        objClone[key] = this.DeepClone(obj[key]);
                    } else {
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }

        return objClone;
    }
    DeepClonePlus(obj) {
        if (obj === null) return null;
        if (typeof obj !== 'object') return obj;
        if (obj.constructor === Date) return new Date(obj);
        if (obj.constructor === RegExp) return new RegExp(obj);

        //保持继承链
        let newObj = new obj.constructor();
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                //不遍历其原型链上的属性
                let val = obj[key];
                // 使用arguments.callee解除与函数名的耦合
                newObj[key] = typeof val === 'object' ? this.DeepClonePlus(val) : val;
            }
        }

        return newObj;
    }
    // 值拷贝
    ValueCopyHandler(to, from) {
        for (let x of Object.keys(from)) {
            // to 不存在的字段跳过
            if (!to[x]) continue;
            // from 值不正常的跳过
            if (!from[x] && from[x] !== 0) continue;

            if (from[x] instanceof Array) {
                to[x] = from[x];
                // for (let i in from[x]) {
                //     if (typeof from[x][i] === 'object') {
                //         if (!to[x][i]) to[x][i] = {};
                //         this.ValueCopyHandler(to[x][i], from[x][i]);
                //     } else {
                //         to[x] = from[x];
                //     }
                // }
            } else if (typeof from[x] === 'object') {
                this.ValueCopyHandler(to[x], from[x]);
            } else {
                to[x] = from[x];
            }
        }
    }
    // 移除所有 html 标签
    RemoveStringHTMLTagOperate(str) {
        if (typeof str == 'string') {
            return str.replace(/<[^>]+>/g, '');
        } else {
            return str || '';
        }
    }
    // 生成任意位数的随机数
    BuildRandomStringOperate(digit, mode = 'number') {
        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        function generateMixed(n) {
            let result = '';

            for (let i = 0; i < n; i++) {
                if (mode == 'number') {
                    let id = Math.ceil(Math.random() * numbers.length);
                    result += numbers[id];
                } else if (mode == 'letter') {
                    let id = Math.ceil(Math.random() * letter.length);
                    result += letter[id];
                } else {
                    let chars = numbers.concat(letter),
                        id = Math.ceil(Math.random() * chars.length);

                    result += chars[id];
                }
            }

            return result;
        }

        return generateMixed(digit);
    }
    // 读取本地存储的封装
    ReadLocalStorage(key) {
        if (typeof window === 'undefined') return false;

        try {
            var storage = localStorage.getItem(key);

            storage = JSON.parse(storage);
            if (storage) {
                return storage;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    ReadSessionStorage(key) {
        if (typeof window === 'undefined') return false;

        try {
            var storage = sessionStorage.getItem(key);

            storage = JSON.parse(storage);
            if (storage) {
                return storage;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

export default Utils;
