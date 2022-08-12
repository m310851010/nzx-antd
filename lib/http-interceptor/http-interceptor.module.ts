import { NgModule } from '@angular/core';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { httpInterceptors } from './http-interceptor.config';
import { AsyncHttpXhrBackend } from './xhr';
import { NzxModalModule } from '@xmagic/nzx-antd/modal';

@NgModule({
  imports: [HttpClientModule, NzxModalModule],
  providers: [httpInterceptors, AsyncHttpXhrBackend, { provide: HttpBackend, useExisting: AsyncHttpXhrBackend }]
})
export class NzxHttpInterceptorModule {}
