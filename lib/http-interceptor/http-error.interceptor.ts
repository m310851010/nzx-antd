import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpError } from './http.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxAntdService } from '@xmagic/nzx-antd';

/**
 * http 请求发生错误后进行处理
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(protected antdService: NzxAntdService) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    return next.handle(req).pipe(catchError(error => this.handleError(req, error)));
  }

  /**
   * 将错误响应包装为统一格式
   * @param req
   * @param errorResponse
   */
  handleError(req: HttpRequest<NzSafeAny>, errorResponse: HttpErrorResponse) {
    if (this.antdService.handleHttpError) {
      return this.antdService.handleHttpError(req, errorResponse) as Observable<never>;
    }

    const { status: code, error, message } = errorResponse;
    return throwError(() => new HttpError(true, code, message, error));
  }
}
