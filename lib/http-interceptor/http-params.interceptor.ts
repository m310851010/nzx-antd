import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpDefaultCodec } from './http-default-encoder';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxUtils } from '@xmagic/nzx-antd/util';

/**
 * 请求参数处理
 */
@Injectable()
export class HttpParamsInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    return next.handle(this.processParameters(req));
  }

  processParameters(req: HttpRequest<NzSafeAny>) {
    if (req.params == null) {
      return req;
    }
    return req.clone({
      params: this.processGetParams(req.params)
    });
  }

  processGetParams(params: HttpParams) {
    const result: Record<string, NzSafeAny> = { r: Math.random() };

    params.keys().reduce((acc, key) => {
      const values = params.getAll(key);
      if (values) {
        acc[key] = values.length > 1 ? values : values[0];
        return acc;
      }
      return acc;
    }, result);

    return new HttpParams({ fromString: NzxUtils.serialize(result), encoder: HttpDefaultCodec });
  }
}
