import { isNil, omitBy, without } from 'lodash';

export function omitArrEmpty(arr) {
  return without(arr, [null, undefined]);
}
export function omitObjEmpty(obj) {
  return omitBy(obj, isNil);
}

/**
 * 存储数据
 */
export function set(key, value) {
  localStorage.setItem(key, value);
}
/**
 * 读取的数据
 */
export function get(key) {
  return localStorage.getItem(key);
}
/**
 * 删除数据
 */
export function remove(key) {
  localStorage.removeItem(key);
}
