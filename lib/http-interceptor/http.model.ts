import { NzSafeAny } from 'ng-zorro-antd/core/types'

/**
 * 服务端响应实体, 可以通过设置 http请求参数
 * {observe: 'response'} 拿到完整数据
 */
export interface ResponseModel<T = NzSafeAny> {
  /**
   * 服务端返回编码
   */
  code?: number;
  message?: string;
  data?: T;
}

/**
 * http 请求出错后，在中间件中封闭为统一的格式。
 */
export class HttpError<T = NzSafeAny> {
  /**
   *
   * @param httpError 是否是HTTP原始异常
   * @param code 错误码, 如果是HTTP原始异常,则为status code
   * @param message 错误消息
   * @param body 返回数据
   */
  constructor(public httpError: boolean, public code: number, public message: string, public body: T) {}
}
