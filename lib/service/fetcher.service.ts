import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Any } from '@xmagic/nzx-antd';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * 模板字符串函数, 构造同步请求URL
 * @example
 * let value!: string;
 * this.http.get<string>('url', { context: new HttpContext().set(SYNCED_ENABLED, true)}).subscribe(res => (value = res));
 * console.log(value);
 */
export function synced(url: TemplateStringsArray, ...keys: string[]): string {
  const strings = [];
  for (let i = 0; i < url.length; i++) {
    strings.push(url.raw[i], keys[i] == null ? '' : keys[i]);
  }
  const result = strings.join('');
  return result + (result.indexOf('?') === -1 ? '?' : '&') + 'synced=true';
}

/**
 * 启用同步请求
 * @example
 * let value!: string;
 * this.http.get<string>('url', { context: new HttpContext().set(SYNCED_ENABLED, true)}).subscribe(res => (value = res));
 * console.log(value);
 */
export const SYNCED_ENABLED = new HttpContextToken<boolean>(() => false);

/**
 * 是否启用loading
 * @example
 * this.http.get<string>('url', { context: new HttpContext().set(LOADING_ENABLED, false).set(...)});
 */
export const LOADING_ENABLED = new HttpContextToken<boolean>(() => true);

@Injectable()
export class FetcherService {
  constructor(protected http: HttpClient) {}

  /**
   * 处理异步参数
   * @param data 参数
   */
  static resolveParams<T>(data?: FetchParams<T>): Observable<T | undefined> {
    if (NzxUtils.isFunction(data)) {
      const result = data();
      if (result instanceof Observable) {
        return result;
      }
      return of(result as T);
    }

    if (data instanceof Observable) {
      return data;
    }
    return of(data as T);
  }

  /**
   * 发起请求, 参数可以是异步对象或函数
   * @param option 请求配置
   */
  fetch<T>(option: FetchOptions): Observable<T> {
    return FetcherService.resolveParams(option.data).pipe(
      switchMap(value => {
        const data = option.beforeSend ? option.beforeSend(value || {}) : value;
        return this.doFetch<T>({ ...option, data });
      })
    );
  }

  /**
   * 同步请求, 参数可以是异步对象或函数
   * @param option 请求配置
   */
  fetchSync<T>(option: Omit<FetchOptions, 'async'>): T {
    return NzxUtils.getAjaxValue<T>(this.fetch({ ...option, async: false }));
  }

  /**
   * 送请求
   * @param options 参数不包含函数不进行二次处理
   */
  public doFetch<T>(options: FetchOptions): Observable<T> {
    const option: Record<string, Any> = {};
    if (options.responseType) {
      option.responseType = options.responseType;
    }
    if (options.observe) {
      option.observe = options.observe;
    }

    option.context ||= new HttpContext();
    if (options.async === false) {
      option.context.set(SYNCED_ENABLED, true);
    }

    if (options.loading === false) {
      option.context.set(LOADING_ENABLED, false);
    }

    const data = NzxUtils.isFunction(options.data) ? options.data() : options.data;
    if (/^post|put$/i.test(options.method!)) {
      option.body = data;
    } else {
      option.params = data;
    }

    return this.http.request<T>(options.method || 'get', options.url, option);
  }

  /**
   * 同步请求, 参数不包含函数不进行二次处理
   * @param options
   */
  doFetchSync<T>(options: Omit<FetchOptions, 'async'>): T {
    return NzxUtils.getAjaxValue<T>(this.doFetch({ ...options, async: false }));
  }

  /**
   * 使用同步方式进行远程校验
   * @param options
   */
  remoteValidate<T = Any>(options: ValidatorOption<T>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || !control.value.length) {
        return null;
      }
      if (options.beforeSend) {
        const beforeSend = options.beforeSend;
        options.beforeSend = data => {
          return beforeSend(data, control);
        };
      }

      if (options.data && NzxUtils.isFunction(options.data)) {
        const dataFn = options.data;
        options.data = () => {
          return dataFn(control);
        };
      }

      // @ts-ignore
      const data = this.doFetchSync<T>(options);
      if (options.afterFetch) {
        return options.afterFetch(data);
      }

      if (data == null) {
        return null;
      }

      if (NzxUtils.isBoolean(data)) {
        return data ? null : { remote: { message: options.message || '格式不正确' } };
      }
      return data;
    };
  }
}

/**
 * 请求参数
 */
export type FetchParams<T = Any> = (() => Promise<T> | T) | Promise<T> | T;

/**
 * 请求配置
 */
export interface FetchOptions {
  url: string;
  /**
   * 请求方式
   */
  method?: string;
  /**
   * 请求参数
   */
  data?: FetchParams;
  /**
   * 发送之前的回调函数,仅URL 时有效
   * @param params
   */
  beforeSend?: (params: Any) => Any;
  /**
   * 响应类型
   */
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  /**
   * 订阅响应数据类型
   */
  observe?: 'body' | 'events' | 'response';
  /**
   * http上下文
   */
  context?: HttpContext;
  /**
   * 是否异步, 默认true
   */
  async?: boolean;
  /**
   * 是否显示loading
   */
  loading?: boolean;
}

/**
 * 验证器请求参数
 */
export type FetchValidatorParams<T = Any> = ((control: AbstractControl) => Promise<T> | T) | Promise<T> | T;
/**
 * 远程验证器配置
 */
export type ValidatorOption<T = Any> = Omit<FetchOptions, 'beforeSend' | 'async' | 'data'> & {
  /**
   * 错误信息描述
   */
  message: string;
  /**
   * 请求参数
   */
  data?: FetchValidatorParams;
  /**
   * 响应数据后的回调
   * @param data
   */
  afterFetch?(data: T): ValidationErrors | null;
  /**
   * 请求之前的回调
   * @param params
   * @param control
   */
  beforeSend?(params: Any, control: AbstractControl): Any;
};


export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';
