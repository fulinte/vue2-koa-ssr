import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhCnMessage from './zh-cn.js';
import { Utils, $axios } from '@src/store/multiplex/actions.js';

Vue.use(VueI18n);

// 缓存当前使用的语言包数据
function setCacheUseLanguage(lang, content) {
    var cacheLang = JSON.stringify({
        locale: lang,
        messages: {
            [lang]: content
        }
    });
    sessionStorage.setItem('UseLanguage', cacheLang);
}

var i18n = null,
    useLanguage = Utils.ReadSessionStorage('UseLanguage');

if (useLanguage === false) {
    useLanguage = {
        locale: 'zh-cn',
        // fallbackLocale: 'en',
        messages: {
            'zh-cn': zhCnMessage
        }
    };
}
i18n = new VueI18n(useLanguage);
// 读取缓存列表中的语言
i18n.asyncSwitchI18nLanguage = async (lang) => {
    var foundItem = i18n.getLocaleMessage(lang),
        resResponse = false;

    if (Object.keys(foundItem).length == 0) {
        let { state, pack_content } = await $axios.asyncRequestInterface('/url-language', {});
        if (state) {
            i18n.mergeLocaleMessage(lang, pack_content);
            i18n.locale = lang;
            setCacheUseLanguage(lang, data);
            resResponse = true;
        }
    } else {
        i18n.locale = lang;
        setCacheUseLanguage(lang, foundItem[lang]);
        resResponse = true;
    }

    return resResponse;
};

export default i18n;
