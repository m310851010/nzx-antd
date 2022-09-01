import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HttpRequestOptions, NzxAntdService } from '@xmagic/nzx-antd';

/**
 * 处理 URL
 */
@Injectable()
export class HttpUrlInterceptor implements HttpInterceptor {
  constructor(protected antdService: NzxAntdService) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    return next.handle(this.processUrl(req));
  }

  processUrl(req: HttpRequest<NzSafeAny>): HttpRequest<NzSafeAny> {
    let url = req.url;
    if (!/^http/i.test(url)) {
      if (!/^\//.test(url)) {
        url = '/' + url;
      }
      url = (this.antdService.basePath || '') + url;
    }

    // 使用自定义请求处理器
    if (this.antdService.handleRequest) {
      const newReq = this.antdService.handleRequest(req, url);
      if (newReq) {
        if ((newReq as HttpRequest<NzSafeAny>).clone) {
          return newReq as HttpRequest<NzSafeAny>;
        }
        const option = newReq as HttpRequestOptions;
        if (!option.url) {
          option.url = this.wrapRandomUrl(url);
        }
        return req.clone(option);
      }
    }
    return req.clone({ url: this.wrapRandomUrl(url) });
  }

  private wrapRandomUrl(url: string) {
    return url + (url.indexOf('?') >= 0 ? '&r=' : '?r=') + Math.random();
  }
}
