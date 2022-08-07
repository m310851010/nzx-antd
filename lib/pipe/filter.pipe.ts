import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Utils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform<T = NzSafeAny>(array: T[], matcher: string, searchText?: string): T[];
  transform<T = NzSafeAny>(array: T[], matcher: FilterMatcherFn<T>): T[];

  /**
   * Filter array
   *
   * 过滤数组
   */
  transform<T = NzSafeAny>(array: T[], matcher: FilterMatcherFn<T> | string, searchText?: string): T[] {
    if (typeof matcher === 'string') {
      if (Utils.isEmpty(searchText)) {
        return array;
      }

      // @ts-ignore
      const text = searchText.toLowerCase();
      return (array || []).filter(v => Utils.get(v, matcher, '').toLowerCase().indexOf(text) !== -1);
    }
    return (array || []).filter(v => matcher(v));
  }
}

export type FilterMatcherFn<T> = (item: T) => boolean;
