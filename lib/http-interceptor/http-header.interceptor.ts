import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { NzSafeAny } from 'ng-zorro-antd/core/types'

/**
 * 对请求头进行处理
 */
@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  constructor(protected antdService: NzxAntdService) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const headers: Record<string, string> = { 'X-Requested-With': 'XMLHttpRequest' };
    if (
      !req.headers.has('Content-Type') &&
      !(req.body instanceof FormData || req.body instanceof ArrayBuffer || req.body instanceof Blob)
    ) {
      headers['Content-Type'] =
        this.antdService.contentType === 'form'
          ? 'application/x-www-form-urlencoded'
          : 'application/json;charset=utf-8';
    }
    const clone = req.clone({
      setHeaders: headers
    });
    return next.handle(clone);
  }
}
