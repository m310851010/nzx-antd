import { Pipe, PipeTransform } from '@angular/core';
import { CellArgType, NzxColumnButton } from '../table.type';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'colButtonVisible'
})
export class ColButtonVisiblePipe implements PipeTransform {
  transform(
    value?: NzxColumnButton['visible']
  ): (row: NzSafeAny, params: CellArgType<NzSafeAny>) => boolean | undefined | null | void {
    if (NzxUtils.isFunction(value)) {
      return value;
    }
    return () => value !== false;
  }
}
