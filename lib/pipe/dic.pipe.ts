import { Pipe, PipeTransform } from '@angular/core';
import { DicService } from '@xmagic/nzx-antd/service';

/**
 * 字典管道
 * @example
 *
 * ``` html
 * {{1 | dic: 'status' | async}}
 *
 * {{'A' | dic: 'status' | async}}
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
   * 字典管道
   * @param key 字典项key
   * @param dicName 字典名称
   */
  transform(key: string | number | null, dicName: string) {
    if (key == null) {
      return null;
    }
    return this.dicService.getLabel(dicName, key);
  }
}
