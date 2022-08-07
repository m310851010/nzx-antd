import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpLoadingInterceptor } from './http-loading.interceptor';
import { HttpUrlInterceptor } from './http-url.interceptor';
import { HttpHeaderInterceptor } from './http-header.interceptor';
import { HttpParamsInterceptor } from './http-params.interceptor';
import { HttpCustomServerErrorInterceptor } from './http-custom-server-error.interceptor';
import { HttpResponseParseInterceptor } from './http-response-parse.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';

/**
 * 注意，中间件是有序的，谨慎调整下列中间件的顺序
 */
export const httpInterceptors = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpUrlInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpParamsInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpCustomServerErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpResponseParseInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];
