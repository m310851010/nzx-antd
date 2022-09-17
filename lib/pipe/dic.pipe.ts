import { Pipe, PipeTransform } from '@angular/core';
import { DicItem, DicService } from '@xmagic/nzx-antd/service';
import { Observable } from 'rxjs';

/**
 * 字典管道
 * @example
 *
 * ``` html
 * {{'status' | dic | async}}
 *
 * {{'status' | dic: true | async}}
 *
 * // 配置filter使用
 *
 * {{'status' | dic | async | filter: 'value' : 'test value' }}
 * ```
 */
@Pipe({
  name: 'dic'
})
export class DicPipe implements PipeTransform {
  constructor(protected dicService: DicService) {}

  /**
   * 字典管道
   * @param key 字典key
   * @param isNumber 是否数字
   * @param isMap 返回数组结构
   */
  transform(key: string, isNumber?: boolean, isMap?: false): Observable<DicItem[]> | null;
  /**
   * 字典管道
   * @param key 字典key
   * @param isNumber 是否数字
   * @param isMap 返回map结构
   */
  transform(key: string, isNumber?: boolean, isMap?: true): Observable<Record<string, string>> | null;

  transform(key: string, isNumber?: boolean, isMap?: boolean): Observable<DicItem[] | Record<string, string>> | null {
    if (key == null) {
      return null;
    }
    return isMap ? this.dicService.getDicMap(key, isNumber) : this.dicService.getDic(key, isNumber);
  }
}
