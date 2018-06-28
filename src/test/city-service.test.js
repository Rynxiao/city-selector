import 'jest-localstorage-mock';
import {
    initialAllCity,
    searchCityByName,
    hasInCityResultList,
    searchCityListByChineseKey,
    searchCityListByEnglishKey,
    saveLocalStorageCity,
    transformCityMenuData
} from '../services/cityServices';

const allCity = {
    'A': [
        { id: '111', city: '鞍山', en: 'anshan' },
        { id: '222', city: '安康', en: 'ankang' }
    ],
    'B': [
        { id: '333', city: '包头', en: 'baotou' }
    ],
    'H': [
        { id: '444', city: '洪湖', en: 'honghu' },
        { id: '666', city: '黄山', en: 'huangshan' }
    ],
    'X': [
        { id: '555', city: '香港', en: 'xianggang' }
    ]
};

const labels = ['A', 'B', 'H', 'X'];

const result = [
    { id: '333', city: '包头', en: 'baotou' },
    { id: '444', city: '洪湖', en: 'honghu' }
];

it('city list length should be 26', () => {
    expect(Object.keys(initialAllCity()).length).toBe(26);
}); 

it('has in city result list', () => {
    const city1 = { id: '333', city: '包头', en: 'baotou' };
    const city2 = { id: '555', city: '香港', en: 'hongkong' };
    expect(hasInCityResultList(city1, result)).toBeTruthy();
    expect(hasInCityResultList(city2, result)).not.toBeTruthy();
});

it('search city list by chinese key', () => {
    expect(searchCityListByChineseKey('包', allCity).length).toBe(1);
    expect(searchCityListByChineseKey('黄', allCity).length).toBe(1);
    expect(searchCityListByChineseKey('山', allCity).length).toBe(2);
    expect(searchCityListByChineseKey('香', allCity).length).toBe(1);
    expect(searchCityListByChineseKey('北', allCity).length).toBe(0);
});

it('search city list by english key', () => {
    expect(searchCityListByEnglishKey('h', labels, allCity).length).toBe(2);
    expect(searchCityListByEnglishKey('x', labels, allCity).length).toBe(1);
    expect(searchCityListByEnglishKey('s', labels, allCity).length).toBe(0);
});

it('search city by name', () => {
    expect(searchCityByName('h', labels, allCity).length).toBe(2);
    expect(searchCityByName('s', labels, allCity).length).toBe(0);
    expect(searchCityByName('北', labels, allCity).length).toBe(0);
    expect(searchCityByName('山', labels, allCity).length).toBe(2);
});

it('test save lastest city', () => {
    let lastestCity = saveLocalStorageCity('lastest', '成都');
    expect(lastestCity[0]).toBe('成都');

    lastestCity = saveLocalStorageCity('lastest', '成都');
    expect(lastestCity[0]).toBe('成都');

    lastestCity = saveLocalStorageCity('lastest', '武汉');
    expect(lastestCity[1]).toBe('武汉');

    lastestCity = saveLocalStorageCity('lastest', '深圳');
    expect(lastestCity[0]).toBe('武汉');
});

it('transform city data', () => {
    const tCity = transformCityMenuData(result);
    expect(tCity[0].label).toBe('包头');
});