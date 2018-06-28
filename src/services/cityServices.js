import axios from 'axios';
import { 
    isEnglishString, 
    isChineseString,
    saveLocalStorage,
    getLocalStorage 
} from '../utils';

const hotCityLabels = ['北京', '上海', '深圳', '广州', '武汉', '成都'];
const LASTEST_CITY = 'LASTEST_CITY';
const CITY_API = '/waether/upload/weather/json/NationalUrbanData.min.json';

function initialAllCity() {
    const city = {};
    for (let i = 0; i < 26; i++) {
        city[String.fromCharCode(65 + i)] = [];
    }
    return city;
}

function filterCity(city) {
    const validateLetters = [];
    const allCity = {};
    Object.keys(city).forEach(c => {
        const cityCollectoin = city[c];
        if (cityCollectoin.length > 0) {
            validateLetters.push(c);
            allCity[c] = city[c];
        }
    });

    return {
        validateLetters,
        allCity
    }
}

function formatCites(json) {
    const beforeFilterAllCity = initialAllCity();
    const hotCity = [];
    const city = json.data.city;

    Object.keys(city).forEach(c => {
        const cityCollection = city[c] || [];
        cityCollection.forEach(cc => {
            const firstLetter = cc.en && cc.en[0].toUpperCase();
            if (cc.en === 'hongkong') {
                cc.en = 'xianggang';
                beforeFilterAllCity['X'].push(cc);
            } else {
                beforeFilterAllCity[firstLetter].push(cc);
            }
            
            if (hotCityLabels.includes(cc.city)) {
                hotCity.push(cc);
            }
        })
    });

    const afterFilterAllCity = filterCity(beforeFilterAllCity);

    return {
        hotCity,
        afterFilterAllCity
    };
}

function hasInCityResultList(city, result) {
    return result.some(r => {
        return r.id === city.id;
    });
}

function searchCityListByChineseKey(key, allCity) {
    const result = [];

    Object.keys(allCity).forEach(cityCode => {
        const cityCollection = allCity[cityCode];
        cityCollection.forEach(city => {
            if (city.city.includes(key) && !hasInCityResultList(city, result)) {
                result.push(city);
            }
        });
    });

    return result;
}

function searchCityListByEnglishKey(key, labels, allCity) {
    let result = [];
    const firstLetter = key.toUpperCase()[0];

    if (!labels.includes(firstLetter)) {
        return result;
    }
    
    allCity[firstLetter].forEach(city => {
        if (city.en.includes(key) && !hasInCityResultList(city, result)) {
            result.push(city);
        }
    });

    return result;
}

function searchCityByName(key, labels, allCity) {
    let result = [];

    if (!key.length) {
        return result;
    }
    
    if (isChineseString(key)) {
        result = searchCityListByChineseKey(key, allCity);
    } else if (isEnglishString(key)) {
        result = searchCityListByEnglishKey(key, labels, allCity);
    }

    return result;
}

async function getAllCities() {
    const json = await axios.get(CITY_API);
    return formatCites(json);
}

function saveLocalStorageCity(key, city) {
    const lastestCity = getLocalStorageCity(key);

    if (!lastestCity.includes(city)) {
        if (lastestCity.length >= 2) {
            lastestCity.splice(0, 1);
        }
        lastestCity.push(city);
        saveLocalStorage(key, lastestCity.join(':'));
    }

    return lastestCity;
}

function getLocalStorageCity(key) {
    const cityInfo = getLocalStorage(key);
    return cityInfo ? cityInfo.split(':') : []; 
}

function transformCityMenuData(city) {
    return city.map(c => ({ value: c.city, label: c.city }));
}

export {
    LASTEST_CITY,
    getAllCities,
    searchCityByName,
    initialAllCity,
    filterCity,
    formatCites,
    hasInCityResultList,
    searchCityListByChineseKey,
    searchCityListByEnglishKey,
    saveLocalStorageCity,
    getLocalStorageCity,
    transformCityMenuData
}