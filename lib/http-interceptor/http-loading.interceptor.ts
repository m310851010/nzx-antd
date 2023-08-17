import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';
import { HttpLoadingService } from './http-loading.service';
import { LOADING_ENABLED } from '@xmagic/nzx-antd/service';
import { Any } from '@xmagic/nzx-antd';

/**
 * http 请求发送时，调用 loading service 显示加载中图标或者做一些其它处理。
 */
@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  private showStatusChange = new Subject<boolean>();
  private requestCount = 0;

  constructor(private loadingService: HttpLoadingService) {
    this.loadingService.init(this.showStatusChange.pipe(filter(() => this.requestCount === 0)));
  }

  intercept(req: HttpRequest<Any>, next: HttpHandler): Observable<HttpEvent<Any>> {
    const show = req.context.get(LOADING_ENABLED);
    if (show) {
      this.show();
    }
    return next.handle(req).pipe(finalize(() => show && this.hide()));
  }

  /**
   * 显示loading
   */
  show() {
    this.showStatusChange.next(true);
    this.requestCount++;
  }

  /**
   * 隐藏loading
   */
  hide() {
    this.requestCount--;
    this.showStatusChange.next(false);
  }
}
