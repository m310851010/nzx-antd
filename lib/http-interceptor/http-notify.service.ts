import { Injectable } from '@angular/core';
import { NzModalWrapService } from '@xmagic/nzx-antd/modal';
import { HttpError, ResponseModel } from './http.model';

/**
 * 对于异常的处理
 */
@Injectable({ providedIn: 'root' })
export class HttpNotifyService {
  private isOpen = false;
  constructor(protected modal: NzModalWrapService) {}

  /**
   * 通用的业务异常
   * @param error
   */
  notifyCustomServerError(error: HttpError<ResponseModel>) {
    this.showErrorModal(error.message);
  }

  /**
   * http原始异常
   * @param error
   */
  notifyHttpOriginError(error: HttpError): void {
    const messageMap: Record<string, string> = {
      0: '请求网络错误，请检查网络是否正常',
      404: '请求的地址不存在，请检查地址是否正确',
      403: '您没有操作权限'
    };
    this.showErrorModal(messageMap[error.code] || '请求发生错误，请联系管理员');
  }

  private showErrorModal(message: string) {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    this.modal
      .error({
        nzTitle: '错误',
        nzContent: message
      })
      .afterClose.subscribe(() => (this.isOpen = false));
  }
}
