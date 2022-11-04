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
    return next.handle(req).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * 将错误响应包装为统一格式
   */
  handleError(errorResponse: HttpErrorResponse) {
    if (this.antdService.handleHttpError) {
      const httError = this.antdService.handleHttpError(errorResponse);
      return throwError(() => httError);
    }

    const { status: code, error, message } = errorResponse;
    return throwError(() => new HttpError(true, code, message, error));
  }
}
