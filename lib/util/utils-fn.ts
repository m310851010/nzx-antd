import { NzSafeAny } from 'ng-zorro-antd/core/types';

const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
const reEscapeChar = /\\(\\)?/g;
const INFINITY = 1 / 0;
const reIsUint = /^(?:0|[1-9]\d*)$/;

const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
const toStr = objectProto.toString;

const funcToString = Function.prototype.toString;

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reIsHostCtor = /^\[object .+?Constructor\]$/;
const reIsNative = RegExp(
  '^' +
    funcToString
      .call(hasOwnProperty)
      .replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
    '$'
);

/**
 * 根据属性路径获取对象的属性值
 * @param obj 原始对象
 * @param path 属性路径
 * @param defaultValue 当属性不存在或为undefined返回defaultValue
 */
export function get(obj: NzSafeAny, path: string, defaultValue?: NzSafeAny) {
  const segments = stringToPath(path);
  let index = 0;
  const length = segments.length;

  while (obj != null && index < length) {
    obj = obj[toKey(segments[index++])];
  }
  return index && index === length ? obj : defaultValue;
}

/**
 *
 * 根据属性路径设置值
 * @param object 待修改对象
 * @param path 属性路径
 * @param value 设置的值
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * NzxUtils.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * NzxUtils.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
export function set(object: NzSafeAny, path: string, value: NzSafeAny) {
  return object == null ? object : baseSet(object, path, value);
}

export function is(val: NzSafeAny, type: string) {
  return toStr.call(val) === `[object ${type}]`;
}

export function isObject(value: NzSafeAny) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

export function assignValue(object: NzSafeAny, key: string, value: NzSafeAny) {
  const objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}
function toKey(value: string | number) {
  if (typeof value === 'string') {
    return value;
  }
  const result = value + '';
  return result === '0' && 1 / value === -INFINITY ? '-0' : result;
}

function stringToPath(string: string) {
  const result: string[] = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, (match, number, quote, subString) => {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
    return '';
  });
  return result;
}

function baseSet(
  object: NzSafeAny,
  _path: string,
  value: NzSafeAny,
  customizer: (objValue: NzSafeAny, key: string, nested: NzSafeAny) => NzSafeAny = obj => obj
) {
  if (!isObject(object)) {
    return object;
  }
  const path = stringToPath(_path);

  let index = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested = object;

  while (nested != null && ++index < length) {
    const key = toKey(path[index]);
    let newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index !== lastIndex) {
      const objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

function isIndex(value: NzSafeAny | number, length?: number) {
  const type = typeof value;
  length = length == null ? Number.MAX_SAFE_INTEGER : length;

  return (
    !!length &&
    (type === 'number' || (type !== 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 === 0 &&
    value < length
  );
}

function eq(value: NzSafeAny, other: NzSafeAny) {
  return value === other || (value !== value && other !== other);
}

const defineProperty = (() => {
  try {
    const func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
})();

function getValue(object: NzSafeAny, key: string) {
  return object == null ? undefined : object[key];
}

function getNative(object: NzSafeAny, key: string) {
  const value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

function baseIsNative(value: NzSafeAny) {
  if (!isObject(value)) {
    return false;
  }
  const pattern = is(value, 'Function') ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

function baseAssignValue(object: NzSafeAny, key: string, value: NzSafeAny) {
  if (key === '__proto__' && defineProperty) {
    defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true
    });
  } else {
    object[key] = value;
  }
}

function toSource(func: Function): string {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}
