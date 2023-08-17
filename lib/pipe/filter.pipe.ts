import { Pipe, PipeTransform } from '@angular/core';
import { Any } from '@xmagic/nzx-antd';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'filter',
  pure: true
})
export class FilterPipe implements PipeTransform {
  transform<T = Any>(array: T[], matcher: string, searchText?: string): T[];
  transform<T = Any>(array: T[], matcher: FilterMatcherFn<T>): T[];

  /**
   * Filter array
   *
   * 过滤数组
   */
  transform<T = Any>(array: T[], matcher: FilterMatcherFn<T> | string, searchText?: string): T[] {
    if (typeof matcher === 'string') {
      if (NzxUtils.isEmpty(searchText)) {
        return array;
      }

      // @ts-ignore
      const text = searchText.toLowerCase();
      return (array || []).filter(v => NzxUtils.get(v, matcher, '').toLowerCase().indexOf(text) !== -1);
    }
    return (array || []).filter(v => matcher(v));
  }
}

export type FilterMatcherFn<T> = (item: T) => boolean;
