import { Pipe, PipeTransform } from '@angular/core';
import { DicItem, DicService } from '@xmagic/nzx-antd/service';
import { map, Observable, of } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';

/**
 * 字典管道
 * @example
 *
 * ``` html
 * {{1 | dic: 'status' | async}} // 'label'
 *
 * {{'A' | dic: 'status' | async}} // 'label'
 *
 * {{'A' | dic: statusObservable$ | async}} // 'label'
 *
 * {{'A' | dic: statusObservable$ : true | async}} // dic item
 *
 *
 * ```
 */
@Pipe({
  name: 'dic',
  pure: true
})
export class DicPipe implements PipeTransform {
  constructor(protected dicService: DicService) {}

  /**
   * 字典管道, 获取字典项label
   * @param key 字典项key
   * @param dicItemsOrKey 字典名称
   */
  transform(
    key: string | number | null,
    dicItemsOrKey: Observable<DicItem[] | undefined | null> | string
  ): Observable<string>;

  /**
   * 字典管道, 获取字典项label
   * @param key 字典项key
   * @param dicItemsOrKey 字典名称
   * @param isGetItem 获取字典项label
   */
  transform(
    key: string | number | null,
    dicItemsOrKey: Observable<DicItem[] | undefined | null> | string,
    isGetItem: false
  ): Observable<string>;

  /**
   * 字典管道, 获取字典项
   * @param key 字典项key
   * @param dicItemsOrKey 字典名称
   * @param isGetItem 获取字典项
   */
  transform(
    key: string | number | null,
    dicItemsOrKey: Observable<DicItem[] | undefined | null> | string,
    isGetItem: true
  ): Observable<DicItem>;

  /**
   * 字典管道
   * @param key 字典项key
   * @param dicItemsOrKey 字典名称
   * @param isGetItem 是否获取字典项
   */
  transform(
    key: string | number | null,
    dicItemsOrKey: Observable<DicItem[] | undefined | null> | string,
    isGetItem?: boolean
  ): Observable<string | null | DicItem> {
    if (key == null) {
      return of(null);
    }
    const dic$ = NzxUtils.isString(dicItemsOrKey) ? this.dicService.getDic(dicItemsOrKey) : dicItemsOrKey;
    return dic$.pipe(map(list => NzxUtils.listToMap(list, 'value', isGetItem ? (v: DicItem) => v : 'label')[key]));
  }
}
