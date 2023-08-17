import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Any } from '@xmagic/nzx-antd';
import { HttpRequestOptions, NzxAntdService } from '@xmagic/nzx-antd';

/**
 * 处理 URL
 */
@Injectable()
export class HttpUrlInterceptor implements HttpInterceptor {
  constructor(protected antdService: NzxAntdService) {}

  intercept(req: HttpRequest<Any>, next: HttpHandler): Observable<HttpEvent<Any>> {
    return next.handle(this.processUrl(req));
  }

  processUrl(req: HttpRequest<Any>): HttpRequest<Any> {
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
        if ((newReq as HttpRequest<Any>).clone) {
          return newReq as HttpRequest<Any>;
        }
        const option = newReq as HttpRequestOptions;
        if (!option.url) {
          option.url = url;
        }
        return req.clone(option);
      }
    }
    return req.clone({ url });
  }
}
