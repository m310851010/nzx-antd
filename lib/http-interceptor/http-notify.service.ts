import { Injectable } from '@angular/core';
import { NzxModalWrapService } from '@xmagic/nzx-antd/modal';
import { HttpError, ResponseModel } from './http.model';
import { DEFAULT_STATUS_MESSAGE_MAP, NzxAntdService } from '@xmagic/nzx-antd';
import { Subject, filter } from 'rxjs';

/**
 * 对于异常的处理
 */
@Injectable({ providedIn: 'root' })
export class HttpNotifyService {
  private isOpen = false;
  private readonly errorSubject = new Subject<string>();
  private readonly statusMessageMap: Record<string, string> = {};

  constructor(protected modal: NzxModalWrapService, protected antdService: NzxAntdService) {
    this.statusMessageMap = Object.assign({}, DEFAULT_STATUS_MESSAGE_MAP, antdService.response?.statusMessageMap || {});
    this.errorSubject.pipe(filter(() => !this.isOpen)).subscribe(message => this.showErrorModal(message));
  }

  /**
   * 通用的业务异常
   * @param error
   */
  notifyCustomServerError(error: HttpError<ResponseModel>) {
    this.errorSubject.next(error.message);
  }

  /**
   * http原始异常
   * @param error
   */
  notifyHttpOriginError(error: HttpError): void {
    this.errorSubject.next(this.statusMessageMap[error.code] || this.statusMessageMap.other);
  }

  protected showErrorModal(nzContent: string) {
    this.isOpen = true;
    this.modal
      .error({
        nzTitle: '错误',
        nzContent
      })
      .afterClose.subscribe(() => (this.isOpen = false));
  }
}
