import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { HttpError } from './http.model';
import { LogoutService } from './logout.service';
import { DEFAULT_RESPONSE_SETTING, NzxAntdService, ResponseSetting } from '@xmagic/nzx-antd';
import { NzxUtils } from '@xmagic/nzx-antd/util';

/**
 * 在 http-error-interceptor 后，进行自定义错误处理。
 */
@Injectable()
export class HttpCustomServerErrorInterceptor implements HttpInterceptor {
  protected readonly settings: Required<ResponseSetting>;

  constructor(protected logoutNotify: LogoutService, protected antdService: NzxAntdService) {
    this.settings = NzxUtils.extend(
      {},
      DEFAULT_RESPONSE_SETTING,
      this.antdService.response
    ) as Required<ResponseSetting>;
  }

  intercept(req: HttpRequest<HttpError>, next: HttpHandler): Observable<HttpEvent<HttpError>> {
    return next.handle(req).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * 只抛出自定义异常, 对于http内部异常由拦截器统一处理
   * @param error
   * @param caught 原始异常
   */
  handleError(error: HttpError, caught: Observable<HttpEvent<HttpError>>) {
    if (error.httpError) {
      return this.settings.handleError(error, caught);
      // 登录超时  强制下线
    } else if (this.settings.timeout(error) || this.settings.forceLogout(error)) {
      this.logoutNotify.notifyLogin(error);
    }
    return this.settings.handleError(error, caught);
  }
}
