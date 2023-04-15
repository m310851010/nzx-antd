import { NgModule } from '@angular/core';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { httpInterceptors } from './http-interceptor.config';
import { AsyncHttpXhrBackend } from './xhr';

@NgModule({
  imports: [HttpClientModule],
  providers: [httpInterceptors, AsyncHttpXhrBackend, { provide: HttpBackend, useExisting: AsyncHttpXhrBackend }]
})
export class NzxHttpInterceptorModule {}
