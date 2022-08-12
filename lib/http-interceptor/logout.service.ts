import { Injectable } from '@angular/core';
import { HttpError, ResponseModel } from './http.model';
import { Subject, Subscription } from 'rxjs';
import { NzxModalWrapService } from '@xmagic/nzx-antd/modal';
import { throttleTime } from 'rxjs/operators';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { DEFAULT_RESPONSE_SETTING, NzxAntdService, ResponseSetting } from '@xmagic/nzx-antd'

/**
 * 退出通知
 */
@Injectable({ providedIn: 'root' })
export class LogoutService {
  protected readonly timeoutFn: (error: HttpError) => boolean;
  private loginNotify$ = new Subject<LogoutType>();

  constructor(protected modal: NzxModalWrapService, protected antdService: NzxAntdService) {
    this.timeoutFn = NzxUtils.extend<ResponseSetting>({}, DEFAULT_RESPONSE_SETTING, this.antdService.response).timeout!;
  }

  notifyLogin(error: HttpError<ResponseModel>): void {
    this.loginNotify$.next({
      message: error.message,
      url: (error.body as { url?: string })?.url,
      timeout: this.timeoutFn(error)
    });
  }

  /**
   * 静默通知退出
   * @param message 提示消息
   * @param code 错误码 -1 不显示提示信息
   */
  notifyLogout(message: string = '', code = 0): void {
    this.notifyLogin(new HttpError(false, code, message, {}));
  }

  /**
   * 执行退出登录Observable
   * @param logoutType
   */
  logout(logoutType: LogoutType): void {
    this.loginNotify$.next(logoutType);
  }

  onLogout(fn: (logoutType: LogoutType) => void): Subscription {
    return this.loginNotify$.asObservable().pipe(throttleTime(2000)).subscribe(fn);
  }
}

export interface LogoutType {
  /**
   * url
   */
  url?: string;
  /**
   * 是否超时
   */
  timeout?: boolean;
  /**
   * 错误信息
   */
  message?: string;
}
