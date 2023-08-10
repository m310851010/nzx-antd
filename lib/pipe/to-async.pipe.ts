import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetcherService, FetchOptions } from '@xmagic/nzx-antd/service';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * 把请求信息转换为异步对象
 */
@Pipe({
  name: 'toAsync',
  pure: true
})
export class ToAsyncPipe implements PipeTransform {
  constructor(private fetcher: FetcherService) {}

  /**
   * 转换为Observable
   * @param value 可以是url或者Observable, Promise
   * @param option 配置项
   */
  transform<T = NzSafeAny, U = NzSafeAny>(
    value: string | Observable<T> | Promise<T> | T,
    option?: AsyncOption
  ): Observable<U> | null {
    if (value == null) {
      return of(option?.defaultValue as U);
    }

    const opt = option || ({} as AsyncOption);
    const mapFn = NzxUtils.isFunction(opt.map) ? opt.map : (data: T) => data as unknown as U;
    if (typeof value === 'string') {
      return this.fetcher.fetch<T>({ ...opt, url: value }).pipe(
        map(v => NzxUtils.defaultIfy(v, option?.defaultValue)),
        map<T, U>(mapFn)
      );
    }

    if (NzxUtils.isPromise(value) || NzxUtils.isObservable(value)) {
      return from(value).pipe(
        map(v => NzxUtils.defaultIfy(v, option?.defaultValue)),
        map<T, U>(mapFn)
      );
    }

    return of(value as T).pipe(map<T, U>(mapFn));
  }
}

/**
 * 异步请求信息
 */
export type AsyncOption = Omit<FetchOptions, 'url'> & {
  /**
   * 映射数据
   * @param data
   * @param index
   */
  map?: (data: NzSafeAny) => NzSafeAny;
  /**
   * 默认值
   */
  defaultValue?: NzSafeAny;
};
