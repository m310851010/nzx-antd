import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { HttpNotifyService } from './http-notify.service';
import { HttpError } from './http.model';
import { LogoutService } from './logout.service';
import { DEFAULT_RESPONSE_SETTING, NzxAntdService, ResponseSetting } from '@xmagic/nzx-antd';
import { Utils } from '@xmagic/nzx-antd/util';

/**
 * 在 http-error-interceptor 后，进行自定义错误处理。
 */
@Injectable()
export class HttpCustomServerErrorInterceptor implements HttpInterceptor {
  protected readonly settings: Required<ResponseSetting>;

  constructor(
    protected notify: HttpNotifyService,
    protected logoutNotify: LogoutService,
    protected antdService: NzxAntdService
  ) {
    this.settings = Utils.extend({}, DEFAULT_RESPONSE_SETTING, this.antdService.response) as Required<ResponseSetting>;
  }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * 只抛出自定义异常, 对于http内部异常由拦截器统一处理
   * @param error
   */
  handleError(error: HttpError) {
    if (error.httpError) {
      this.notify.notifyHttpOriginError(error);
      // 登录超时  强制下线
    } else if (this.settings.timeout(error) || this.settings.forceLogout(error)) {
      this.logoutNotify.notifyLogin(error);
    } else if (this.settings.defaultError(error)) {
      this.notify.notifyCustomServerError(error);
    }
    return throwError(() => error);
  }
}
