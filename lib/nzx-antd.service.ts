import { Injectable } from '@angular/core';
import { HttpContext, HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NzxAntdService {
  /**
   * 默认请求数据类型, 默认 json
   */
  contentType?: 'form' | 'json';
  /**
   * 请求的根路径,例如/context
   */
  basePath?: string;
  /**
   * 响应的数据配置
   */
  response?: ResponseSetting;
  /**
   * 自定义处理原始请求, 返回null,void则使用默认处理器
   */
  handleRequest?: (req: HttpRequest<NzSafeAny>, url: string) => HttpRequest<NzSafeAny> | null | HttpRequestOptions;
  /**
   * 当发生http异常时(http code 非200), 映射成HttpErrorBean
   */
  handleHttpError?: (req: HttpRequest<NzSafeAny>, errorResponse: HttpErrorResponse) => Observable<HttpErrorBean>;

  /**
   * 是否有权限
   */
  hasAuth?: <T = NzSafeAny>(value: T) => Observable<boolean>;
  /**
   * 权限变更, 通常切换用户时需要
   */
  authChange?: () => Observable<void>;

  /**
   * 无权限时跳转路径
   */
  noAuthUrl?: string;

  /**
   * 表格分页配置
   */
  table?: TableSetting;

  /**
   * 字典配置
   */
  dic?: DicSetting;
  constructor() {}
}

/**
 * 默认配置
 */
export const DEFAULT_RESPONSE_SETTING: ResponseSetting = {
  code: 'code',
  message: 'message',
  data: 'result',
  // tslint:disable-next-line:triple-equals
  success: response => response.body.code == 200,
  // tslint:disable-next-line:triple-equals
  timeout: error => error.code == 401,
  forceLogout: () => false,
  defaultError: error => error.code < 1024
};

/**
 * 默认状态错误信息
 */
export const DEFAULT_STATUS_MESSAGE_MAP: Record<string, string> = {
  0: '请求网络错误，请检查网络是否正常',
  404: '请求的地址不存在，请检查地址是否正确',
  403: '您没有操作权限',
  other: '请求发生错误，请联系管理员'
};

/**
 * 响应配置
 */
export interface ResponseSetting {
  /**
   * code字段名称, 支持路径属性
   */
  code?: string;
  /**
   * message字段名称, 支持路径属性
   */
  message?: string | ((response: HttpResponse<NzSafeAny>) => NzSafeAny);
  /**
   * data字段名称, 支持路径属性
   */
  data?: string | ((response: HttpResponse<NzSafeAny>) => NzSafeAny);
  /**
   * http错误码和错误信息映射,比如 `{404: '请求的地址不存在，请检查地址是否正确', 500: '服务器错误'}`
   * other 表示不匹配任何错误时显示other信息
   */
  statusMessageMap?: { [status: string]: string; other: string };

  /**
   * 是否请求成功
   * @param body 响应对象
   */
  success?: (response: HttpResponse<NzSafeAny>) => boolean;
  /**
   * 是否需要默认错误的错误
   * @param error 错误信息
   */
  defaultError?: (error: HttpErrorBean) => boolean;
  /**
   * 是否登录超时
   * @param error 错误信息
   */
  timeout?: (error: HttpErrorBean) => boolean;
  /**
   * 是否强制退出登录, 比如强制下线
   * @param error 错误信息
   */
  forceLogout?: (error: HttpErrorBean) => boolean;
}

/**
 * 表格配置
 */
export interface TableSetting {
  /**
   * 请求接口当前页数
   */
  pageIndexField?: string;
  /**
   * 每页显示多少条
   */
  pageSizeField?: string;
  /**
   * 请求结果列表字段  支持 a.b.c
   */
  listField?: string;
  /**
   * 请求结果总数字段  支持 a.b.c
   */
  totalField?: string;
  /**
   * 请求方式
   */
  method?: string;
  /**
   *  相应类型
   */
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  /**
   * 分页大小
   */
  nzPageSize?: number;
}

/**
 * 请求公共配置
 */
export interface HttpRequestOptions {
  context?: HttpContext;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  body?: NzSafeAny | null;
  method?: string;
  url?: string;
  setHeaders?: Record<string, NzSafeAny>;
  setParams?: Record<string, NzSafeAny>;
}

export interface HttpErrorBean<T = NzSafeAny> {
  httpError: boolean;
  code: number;
  message: string;
  body: T;
}

/**
 * 字典配置信息
 */
export interface DicSetting {
  /**
   * 字典的URL,如果是string 将会自动在URL后追加key,如 url 为 /api/dic 真正请求的地址为 /api/dic/{dicKey}
   */
  url: ((key: string) => string) | string;
  /**
   * 后台返回的字典label的属性名称, 默认'label'
   */
  labelName?: string;
  /**
   * 后台返回的字典value的属性名称, 默认'value'
   */
  valueName?: string;
}
