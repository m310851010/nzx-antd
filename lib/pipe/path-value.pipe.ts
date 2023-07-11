import { Pipe, PipeTransform } from '@angular/core';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * 根据路径获取数据
 * @example
 * {{ {a: {b: 1}} | pathValue: 'a.b'}} // 1
 */
@Pipe({
  name: 'pathValue'
})
export class PathValuePipe implements PipeTransform {
  transform<T>(value: NzSafeAny, path: string | string[], defaultValue?: NzSafeAny): T {
    return NzxUtils.get(value, path, defaultValue);
  }
}
