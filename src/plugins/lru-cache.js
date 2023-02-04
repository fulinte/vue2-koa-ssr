import LRU from 'lru-cache';

var cacheMainstay = null;

if (process.__API__) {
    cacheMainstay = process.__API__;
} else {
    cacheMainstay = process.__API__ = {
        //配置缓存
        cached: new LRU({
            max: 1024 * 3,
            maxAge: 1000 * 60 * 1
        }),
        cachedItem: {}
    };
}

export default cacheMainstay;
