import 'jest-localstorage-mock';
import { 
    isChineseString, 
    isEnglishString,
    isJSONString,
    saveLocalStorage,
    getLocalStorage 
} from '../utils';

it('中文字符', () => {
    const c1 = 'A';
    const c2 = 'a';
    const c3 = 'abA';
    const c4 = '中';
    const c5 = '中文';
    const c6 = '-';
    expect(isChineseString(c1)).not.toBeTruthy();
    expect(isChineseString(c2)).not.toBeTruthy();
    expect(isChineseString(c3)).not.toBeTruthy();
    expect(isChineseString(c4)).toBeTruthy();
    expect(isChineseString(c5)).toBeTruthy();
    expect(isChineseString(c6)).not.toBeTruthy();
});

it('英文字符串', () => {
    const c1 = 'A';
    const c2 = 'a';
    const c3 = 'abA';
    const c4 = '中';
    const c5 = '中文';
    const c6 = '-';
    expect(isEnglishString(c1)).toBeTruthy();
    expect(isEnglishString(c2)).toBeTruthy();
    expect(isEnglishString(c3)).toBeTruthy();
    expect(isEnglishString(c4)).not.toBeTruthy();
    expect(isEnglishString(c5)).not.toBeTruthy();
    expect(isEnglishString(c6)).not.toBeTruthy();
});

it('获取localstorage', () => {
    const key = 'testSaveLocalStorage';
    const value1 = 'test1';
    const value2 =  '{ "a": 1 }';

    saveLocalStorage(key, value1);
    const result1 = getLocalStorage(key);
    expect(result1).toBe(value1);

    saveLocalStorage(key, value2);
    const result2 = getLocalStorage(key);
    expect(result2.a).toBe(1);
});

it('是否是JSON字符串', () => {
    const value1 = 'test';
    const value2 = null;
    const value3 = undefined;
    const value4 = {};
    const value5 = 1;
    const value6 = '{ "a": 1 }';
    expect(isJSONString(value1)).not.toBeTruthy();
    expect(isJSONString(value2)).toBeTruthy();
    expect(isJSONString(value3)).not.toBeTruthy();
    expect(isJSONString(value4)).not.toBeTruthy();
    expect(isJSONString(value5)).toBeTruthy();
    expect(isJSONString(value6)).toBeTruthy();
});