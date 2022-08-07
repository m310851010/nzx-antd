import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpError, ResponseModel } from './http.model';
import { DEFAULT_RESPONSE_SETTING, NzxAntdService, ResponseSetting } from '@xmagic/nzx-antd';
import { Utils } from '@xmagic/nzx-antd/util';

/**
 * 处理服务器返回的数据，改变其结构。
 */
@Injectable()
export class HttpResponseParseInterceptor implements HttpInterceptor {
  protected readonly settings: Required<ResponseSetting>;
  constructor(protected antdService: NzxAntdService) {
    this.settings = Utils.extend({}, DEFAULT_RESPONSE_SETTING, this.antdService.response) as Required<ResponseSetting>;
  }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(
      switchMap(response => {
        return new Observable<HttpEvent<T>>(observ => {
          if (response.type !== HttpEventType.Response) {
            observ.next(response);
            return;
          }
          this.processData<T>(observ, req, response);
        });
      })
    );
  }

  protected processData<T>(
    subscriber: Subscriber<HttpEvent<T>>,
    req: HttpRequest<T>,
    response: HttpResponse<ResponseModel>
  ) {

    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    const isJsonResponse = contentType.indexOf('application/json') !== -1;
    if (!isJsonResponse) {
      subscriber.next(response as HttpResponse<T>);
      subscriber.complete();
      return;
    }

    const { data: dataProp, code: codeProp, message: messageProp, success: successProp } = this.settings;

    // 处理下载文件错误
    if (isJsonResponse && response.body instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        const err = JSON.parse(reader.result as string) as ResponseModel<T>;
        const httpError = new HttpError(false, Utils.get(err, codeProp, 0), Utils.get(err, messageProp), err);
        subscriber.error(httpError);
      };
      reader.readAsText(response.body);
      return;
    }

    const body = response.body || {};
    if (successProp(response)) {
      const resp = response.clone({ body: dataProp ? Utils.get(body, dataProp) : body });
      subscriber.next(resp);
      subscriber.complete();
    } else {
      const httpError = new HttpError(false, Utils.get(body, codeProp, 0), Utils.get(body, messageProp), body);
      subscriber.error(httpError);
    }
  }
}
