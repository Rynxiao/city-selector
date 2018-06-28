function isChineseString(c) {
    const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d]/;
    return reg.test(c);
}

function isEnglishString(c) {
    const reg = /^[a-zA-Z]/;
    return reg.test(c);
}

function isJSONString(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

function saveLocalStorage(key, obj) {
    if (typeof obj === 'string') {
        window.localStorage.setItem(key, obj);
    } else {
        window.localStorage.setItem(key, JSON.stringify(obj));
    }
}

function getLocalStorage(key) {
    const result = window.localStorage.getItem(key);
    if (isJSONString(result)) {
        return JSON.parse(result);
    }

    return result;
}

function throttle(fn, wait = 500, period = 1000) {
    let startTime = new Date().getTime();
    let timeout;
    return (...args) => {
        return new Promise(resolve => {
            const now = new Date().getTime();
            if (now - startTime >= period) {
                startTime = now;
                resolve(fn.apply(null, args));
            } else {
                timeout && clearTimeout(timeout);
                timeout = setTimeout(() => {
                    resolve(fn.apply(null, args));
                }, wait);
            }
        }); 
    }
}

export {
    isChineseString,
    isEnglishString,
    saveLocalStorage,
    getLocalStorage,
    isJSONString,
    throttle
}