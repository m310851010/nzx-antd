import { ElementRef } from '@angular/core';
import { isNil } from 'ng-zorro-antd/core/util';
import { Observable } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { assignValue, get as _get, isObject as _isObject, is as _is } from './utils-fn';

const hasOwn = Object.prototype.hasOwnProperty;
const gOPD = Object.getOwnPropertyDescriptor;

class UtilsClass {
  assign = this.extend;

  defaultIfy<T = NzSafeAny>(obj: T, defaultValue: NzSafeAny) {
    return isNil(obj) ? defaultValue : obj;
  }

  /**
   * 根据属性路径获取对象的属性值
   * @param obj 原始对象
   * @param path 属性路径
   * @param defaultValue 当属性不存在或为undefined返回defaultValue
   */
  get = _get;

  trim(string: string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
  }

  /**
   * 获取唯一Id号
   */
  getUUID() {
    return Date.now() + Math.random().toString().replace('0.', '');
  }

  /**
   * 深度clone
   * @param target
   */
  clone<T = NzSafeAny>(target: T): T {
    const _target = NzxUtils.isArray(target) ? [] : {};
    return this.extend(_target as T, target);
  }

  // If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
  setProperty = assignValue;

  // Return undefined instead of __proto__ if '__proto__' is not an own property
  getProperty<T = NzSafeAny>(obj: T, name: string) {
    if (name === '__proto__') {
      if (!hasOwn.call(obj, name)) {
        return void 0;
      } else if (gOPD) {
        // @ts-ignore
        return gOPD(obj, name).value;
      }
    }
    // @ts-ignore
    return obj[name];
  }

  /**
   * 继承
   * @param target
   * @param args
   */
  extend<T = NzSafeAny>(target: T, ...args: NzSafeAny[]): T {
    let copyIsArray, clone;

    for (const options of args) {
      if (options == null) {
        continue;
      }

      for (const name in options) {
        const src = this.getProperty(target, name);
        const copy = this.getProperty(options, name);
        if (target === copy || copy === undefined) {
          continue;
        }

        // tslint:disable-next-line:no-conditional-assignment
        if (NzxUtils.isPlainObject(copy) || (copyIsArray = NzxUtils.isArray(copy))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && NzxUtils.isArray(src) ? src : [];
          } else {
            clone = src && NzxUtils.isPlainObject(src) ? src : {};
          }

          this.setProperty(target, name, this.extend(clone, copy));
        } else {
          this.setProperty(target, name, copy);
        }
      }
    }

    return target;
  }

  /**
   * 根据开始和结束数字返回一个数组
   * @param start 起始数字
   * @param end 结束数字
   * @param fill 填充内容,默认
   */
  range<T = NzSafeAny>(start: number, end: number, fill?: ((num: number, index: number) => T) | T): T[] {
    const list: T[] = [];
    const fn = fill == null ? (i: number) => i as unknown as T : this.isFunction(fill) ? fill : () => fill;
    let index = 0;
    for (let i = start; i < end; i++) {
      list.push(fn(i, index++));
    }
    return list;
  }

  /**
   * 遍历树结构
   * @param treeNodes TreeNode[]
   * @param accept 函数返回false即结束遍历, true或者undefined将继续遍历
   * @param childrenName 子节点字段名称
   */
  forEachTree<T extends TreeNode>(
    treeNodes: T[],
    accept: (node: T, parentNode: T | undefined, level: number) => boolean | void,
    childrenName: keyof T | TreeChildren<T> = 'children'
  ): void {
    if (!treeNodes || !treeNodes.length) {
      return;
    }

    const getChildren =
      typeof childrenName === 'string' ? (node: T) => node[childrenName] : (childrenName as TreeChildren<T>);

    let stack: T[] = [...treeNodes];
    const parents: { count: number; parent?: T; level: number }[] = [{ count: treeNodes.length, level: 0 }];
    let counter = 0;

    while (stack.length) {
      const item = stack.shift()!;
      const parent = parents[0];
      if (++counter === parent.count) {
        parents.shift();
        counter = 0;
      }
      if (accept(item, parent.parent, parent.level) === false) {
        return;
      }

      const children = getChildren(item, parent.parent, parent.level);
      if (children && children.length) {
        stack = stack.concat(children);
        parents.push({ count: children.length, parent: item, level: parent.level + 1 });
      }
    }
  }

  /**
   * 过滤树, 生成新的树结构
   * @param treeNodes 树结构
   * @param predicate 过滤函数
   * @param childrenName 子节点名称,默认 'children'
   */
  filterTree<T extends TreeNode>(
    treeNodes: T[],
    predicate: (node: T) => boolean,
    childrenName: keyof T = 'children'
  ): T[] {
    const filter = (list: T[], children: T[]) => {
      for (const node of list) {
        const newNode: T = { ...node, [childrenName]: [] };
        if (node[childrenName]?.length) {
          filter(node[childrenName], newNode[childrenName]);
        }

        if (predicate(newNode)) {
          children.push(newNode);
        }
      }
    };
    const result: T[] = [];
    filter(treeNodes, result);
    return result;
  }

  /**
   * 列表转树结构
   * @param list 列表数据
   * @param idName id的属性名
   * @param pidName parentId属性名
   * @param childrenName children属性名
   */
  listToTree<T extends { pid?: string; id?: string; [key: string]: NzSafeAny }>(
    list: T[],
    idName: keyof T = 'id',
    pidName: keyof T = 'pid',
    childrenName: string = 'children'
  ): T[] {
    if (!list || !list.length) {
      return [];
    }
    const nodeMap: { [key: string]: NzSafeAny } = {};
    for (const node of list) {
      nodeMap[node[idName]] = node;
      // @ts-ignore
      node[childrenName] = [];
    }

    const treeNodes: T[] = [];
    for (const node of list) {
      const pid = node[pidName];
      const parent = nodeMap[node[pidName]];
      if (pid && parent) {
        parent[childrenName].push(node);
      } else {
        treeNodes.push(node);
      }
    }
    return treeNodes;
  }

  /**
   * 获取同步请求的响应结果
   * @param observable
   * @example
   * const myObservable = this.http.get<string>('url', { context: new HttpContext().set(SYNCED_ENABLED, true)});
   * const value = getAjaxValue(myObservable); // value为string类型
   */
  getAjaxValue<T = NzSafeAny>(observable: Observable<T>) {
    let value!: T;
    observable.subscribe(result => (value = result)).unsubscribe();
    return value;
  }

  /**
   * 根据不同的参数类型 获取dom元素
   * @param target
   */
  getElement(target: ElementRef | HTMLElement | string): HTMLElement | null {
    if (!target) {
      return null;
    }

    if (target instanceof HTMLElement) {
      return target;
    }

    const eleRef = target as ElementRef;
    if (eleRef.nativeElement) {
      return eleRef.nativeElement;
    }

    if (typeof target === 'string') {
      return document.querySelector(target);
    }
    return null;
  }

  /**
   * 字符串模版函数
   * @param template 模版
   * @param data 数据
   * @return 返回渲染后的Html
   * @example
   * Utils.format('{s.0.name}', { s: [{name: 111}] }) => 111
   */
  format(template: string | null, data?: Record<string, NzSafeAny>): string {
    if (template == null || !data) {
      return template || '';
    }
    return template.replace(/\{([\w\.]*)\}/g, (str, key) => {
      const path = key.split('.');
      let v = data[path.shift()];
      for (let i = 0, size = path.length; i < size && v !== null; i++) {
        v = v[path[i]];
      }
      return v == null ? '' : v.toString();
    });
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * eg:
   * NeKit.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   * NeKit.formatDate(new Date(), 'yyyy-MM-dd 星期E HH:mm:ss') ==> 2009-03-10 星期二 20:09:04
   * NeKit.formatDate(new Date(), 'yyyy-MM-dd 星期e hh:mm:ss') ==> 2009-03-10 星期2 08:09:04
   * NeKit.formatDate(new Date(), 'yyyy-MM-dd 第w周 hh:mm:ss') ==> 2009-03-10 第2周 08:09:04
   * NeKit.formatDate(new Date(), 'yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
   */
  formatDate(srcDate: Date, fmt: string) {
    if (!srcDate) {
      return '';
    }
    const week = {
      0: '\u65e5',
      1: '\u4e00',
      2: '\u4e8c',
      3: '\u4e09',
      4: '\u56db',
      5: '\u4e94',
      6: '\u516d'
    };

    const o = {
      'M+': srcDate.getMonth() + 1,
      'd+': srcDate.getDate(),
      'h+': srcDate.getHours() % 12 === 0 ? 12 : srcDate.getHours() % 12,
      'H+': srcDate.getHours(),
      'm+': srcDate.getMinutes(),
      's+': srcDate.getSeconds(),
      'q+': Math.floor((srcDate.getMonth() + 3) / 3),
      'S+': srcDate.getMilliseconds(),
      'e+': srcDate.getDay(),
      // @ts-ignore
      E: week[srcDate.getDay()],
      'w+': (date => {
        const date2 = new Date(date.getFullYear(), 0, 1);
        const day = (date2.getDay() ? date2.getDay() : 7) - (date.getDay() ? date.getDay() : 7);
        return Math.ceil(Math.round((date.getTime() - date2.getTime() + day * (24 * 3600000)) / 86400000) / 7) + 1;
      })(srcDate)
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (srcDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        // @ts-ignore
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  }

  is = _is;

  isObject = _isObject;

  isEmpty<T = unknown>(val: T): val is T {
    // @ts-ignore
    return val == null || val.length === 0;
  }

  isDate(val: unknown): val is Date {
    return this.is(val, 'Date');
  }

  isNumber(val: unknown): val is number {
    return this.is(val, 'Number');
  }

  isPromise<T = NzSafeAny>(val: NzSafeAny): val is Promise<T> {
    return this.is(val, 'Promise') || (this.isObject(val) && this.isFunction(val.then) && this.isFunction(val.catch));
  }

  isObservable(obj: NzSafeAny): obj is Observable<NzSafeAny> {
    return obj instanceof Observable || (obj && typeof obj.subscribe === 'function');
  }

  isString(val: unknown): val is string {
    return this.is(val, 'String');
  }

  isFunction(val: unknown): val is Function {
    return typeof val === 'function';
  }

  isBoolean(val: unknown): val is boolean {
    return this.is(val, 'Boolean');
  }

  isRegExp(val: unknown): val is RegExp {
    return this.is(val, 'RegExp');
  }

  isArray(val: NzSafeAny): val is Array<NzSafeAny> {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(val);
    }
    return this.is(val, 'Array');
  }

  isWindow(val: NzSafeAny): val is Window {
    return typeof window !== 'undefined' && this.is(val, 'Window');
  }

  isElement(val: NzSafeAny): val is Element {
    return this.isObject(val) && !!val.tagName;
  }

  isMap(val: unknown): val is Map<NzSafeAny, NzSafeAny> {
    return this.is(val, 'Map');
  }

  /**
   * 是否为手机号（中国）
   * @param value
   */
  isMobile(value: string): boolean {
    return /^(0|\\+?86|17951)?1[0-9]{10}$/.test(value);
  }

  /**
   * 是否IP4地址（支持v4、v6）
   * @param ip
   */
  isIp(ip: string) {
    return /^(?:^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$)|(?:^(?:(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)$/.test(
      ip
    );
  }

  /**
   * 是否是url
   * @param path
   */
  isUrl(path: string): boolean {
    return /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/.test(
      path
    );
  }

  /**
   * 是否中文
   * @param value 测试字符串
   */
  isChinese(value: string): boolean {
    return /^[\u4e00-\u9fa5]+$/.test(value);
  }

  /**
   * 是否为数值
   * @param value
   * @param minus 是否允许负数
   * @param fraction 最大保留小数位数
   */
  isNum(value: string, minus?: boolean, fraction?: number): boolean {
    const regex =
      (minus ? '^-?' : '^') +
      `(([1-9]{1}\\d*)|(0{1}))` +
      (fraction && fraction > 0 ? `(\\.\\d{1,${fraction}})?$` : '$');
    return new RegExp(regex).test(value);
  }

  /**
   * 是否为邮箱
   * @param value
   */
  isEmail(value: string) {
    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
  }

  /**
   * 是否是纯对象值
   * @param obj
   */
  isPlainObject<T = NzSafeAny>(obj: T) {
    if (!obj || !this.isObject(obj)) {
      return false;
    }

    const hasOwnConstructor = hasOwn.call(obj, 'constructor');
    const hasIsPrototypeOf =
      // @ts-ignore
      obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    // @ts-ignore
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
      return false;
    }

    let key;
    for (key in obj) {
      /**/
    }

    return typeof key === 'undefined' || hasOwn.call(obj, key);
  }

  /**
   * 转换为日期
   * @param date 待转换的值
   */
  toDate(date?: Date | string | number): Date | null {
    if (date == null) {
      return null;
    }
    if (this.isDate(date)) {
      return date;
    }
    if (this.isNumber(date)) {
      return new Date(date);
    }
    if (this.isString(date)) {
      const value = Date.parse(date);
      if (isNaN(value)) {
        const match = date.match(/\d+/g);
        if (match) {
          // @ts-ignore
          return new Date(...match);
        }
      }
    }
    return null;
  }

  /**
   * 合并对象到FormData
   * @param obj 要合并的对象
   * @param {FormData} form 表单
   */
  mergeFormData<T>(form: FormData, obj: T): void {
    const list = this.serializeParams(obj);
    for (const it of list) {
      form.append(it.key, it.value);
    }
  }

  /**
   * 把js对象序列化对请求数据,格式为 a=av&b=bv...&n=nv
   * @param obj
   * @returns
   */
  serialize<T>(obj: T): string {
    const list = this.serializeParams<T>(obj);
    let query = '';
    for (const it of list) {
      query += encodeURIComponent(it.key) + '=' + encodeURIComponent(it.value) + '&';
    }
    return query === '' ? query : query.substr(0, query.length - 1);
  }

  /**
   * 把js对象序列化对请求数据
   * @param obj
   * @returns
   */
  serializeParams<T>(obj: T): Record<string, NzSafeAny>[] {
    if (!obj) {
      return [];
    }

    const query: Record<string, NzSafeAny>[] = [];
    this.buildParam(obj, query);
    return query;
  }

  private buildParam<T extends Record<string, NzSafeAny>>(inObj: T, list: Record<string, NzSafeAny>[]) {
    let value: NzSafeAny;
    let subName: string;
    let innerObj: Record<string, string>;
    for (const name in inObj) {
      value = inObj[name];
      if (value instanceof Array) {
        for (let i = 0; i < value.length; ++i) {
          if (value[i] instanceof Array || value[i] instanceof Object) {
            if (value[i].toJSON) {
              list.push({ key: name, value: value[i].toJSON() });
              continue;
            }
            innerObj = {};
            innerObj[name + '[' + i + ']'] = value[i];
            this.buildParam(innerObj, list);
          } else if (value[i] !== undefined && value[i] !== null) {
            list.push({ key: name, value: value[i] });
          }
        }
        continue;
      }
      if (value instanceof Object) {
        if (value.toJSON) {
          list.push({ key: name, value: value.toJSON() });
          continue;
        }

        for (subName of Object.keys(value)) {
          innerObj = {};
          innerObj[name + '.' + subName] = value[subName];
          this.buildParam(innerObj, list);
        }
        continue;
      }
      if (value !== undefined && value !== null) {
        list.push({ key: name, value });
      }
    }
  }
}

export const NzxUtils = new UtilsClass();

/**
 * 树节点
 */
export interface TreeNode {
  [key: string]: NzSafeAny;

  /**
   * 子节点
   */
  children?: TreeNode[];
}

export type TreeChildren<T = NzSafeAny> = (node: T, parentNode: T | undefined, level: number) => T[] | null;
