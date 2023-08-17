import { Pipe, PipeTransform } from '@angular/core';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { Any } from '@xmagic/nzx-antd';

/**
 * 根据路径获取数据
 * @example
 * {{ {a: {b: 1}} | pathValue: 'a.b'}} // 1
 */
@Pipe({
  name: 'pathValue',
  pure: true
})
export class PathValuePipe implements PipeTransform {
  transform<T>(value: Any, path: string, defaultValue?: Any): T {
    return NzxUtils.get(value, path, defaultValue);
  }
}
