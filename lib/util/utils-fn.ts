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
  return index && index === length ? (obj === undefined ? defaultValue : obj) : defaultValue;
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

function isObject(value: NzSafeAny) {
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

export const merge = createAssigner((object, source, srcIndex, customizer) => {
  baseMerge(object, source, srcIndex, customizer);
});

/**
 * Creates a function like `assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(
  assigner: (
    object: NzSafeAny,
    source: NzSafeAny,
    srcIndex: number,
    customizer?: (objValue: NzSafeAny, key: string, nested: NzSafeAny) => NzSafeAny
  ) => void
): <T = NzSafeAny>(object: T, ...source: NzSafeAny[]) => T {
  return (object, ...sources) => {
    let index = -1;
    let length = sources.length;
    let customizer = length > 1 ? sources[length - 1] : undefined;
    const guard = length > 2 ? sources[2] : undefined;

    customizer = assigner.length > 3 && typeof customizer === 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      const source = sources[index];
      if (source) {
        assigner(object, source, index, customizer as NzSafeAny);
      }
    }
    return object;
  };
}

function isIterateeCall(value: NzSafeAny, index: NzSafeAny | number, object: NzSafeAny) {
  if (!isObject(object)) {
    return false;
  }
  const type = typeof index;
  if (type === 'number' ? isArrayLike(object) && isIndex(index, object.length) : type === 'string' && index in object) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * The base implementation of `merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(
  object: object,
  source: object,
  srcIndex: number,
  customizer?: (objValue: NzSafeAny, key: string, nested: NzSafeAny) => NzSafeAny,
  stack?: Map<NzSafeAny, NzSafeAny>
) {
  if (object === source) {
    return;
  }
  for (const key in source) {
    // @ts-ignore
    const srcValue = source[key];
    if (isObject(srcValue)) {
      stack || (stack = new Map());
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer!, stack);
    } else {
      // @ts-ignore
      let newValue = customizer ? customizer(object[key], srcValue, `${key}`, object, source, stack) : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep<T>(
  object: object,
  source: object,
  key: string,
  srcIndex: number,
  mergeFunc: Function,
  customizer: Function | undefined,
  stack: Map<NzSafeAny, NzSafeAny>
) {
  // @ts-ignore
  const objValue = object[key];
  // @ts-ignore
  const srcValue = source[key];

  if (stack.has(srcValue)) {
    assignMergeValue(object, key, stack.get(srcValue));
    return;
  }
  let newValue = customizer ? customizer(objValue, srcValue, `${key}`, object, source, stack) : undefined;

  let isCommon = newValue === undefined;

  if (isCommon) {
    newValue = srcValue;
    if (Array.isArray(srcValue)) {
      if (Array.isArray(objValue)) {
        newValue = objValue;
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (typeof objValue === 'function' || !isObject(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

export function isArguments(value: NzSafeAny): boolean {
  return value != null && is(value, 'Arguments');
}

function toPlainObject(value: NzSafeAny) {
  value = Object(value);
  const result = {};
  for (const key in value) {
    // @ts-ignore
    result[key] = value[key];
  }
  return result;
}

function initCloneObject(object: NzSafeAny) {
  return typeof object.constructor === 'function' && !isPrototype(object)
    ? Object.create(Object.getPrototypeOf(object))
    : {};
}

function isPrototype(value: NzSafeAny) {
  const Ctor = value && value.constructor;
  const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * 是否是纯对象值
 * @param obj
 */
export function isPlainObject<T = NzSafeAny>(obj: T) {
  if (!obj || !is(obj, 'Object')) {
    return false;
  }

  const hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
  const hasIsPrototypeOf =
    // @ts-ignore
    obj.constructor && obj.constructor.prototype && hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
  // @ts-ignore
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  let key;
  for (key in obj) {
    /**/
  }

  return typeof key === 'undefined' || hasOwnProperty.call(obj, key);
}

function assignMergeValue(object: object, key: string, value: NzSafeAny) {
  // @ts-ignore
  if ((value !== undefined && !eq(object[key], value)) || (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

export const isArrayLike = <T>(x: any): x is ArrayLike<T> =>
  x && typeof x.length === 'number' && typeof x !== 'function';
