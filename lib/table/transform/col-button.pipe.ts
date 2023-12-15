import { Pipe, PipeTransform } from '@angular/core';
import { IndexAttr, NzxColumn, NzxColumnButton } from '../table.type';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'colButton'
})
export class ColButtonPipe implements PipeTransform {
  transform(
    buttons: NzxColumn['buttons'] | undefined,
    col: NzxColumn,
    row: NzSafeAny,
    rowIndex: IndexAttr
  ): Observable<NzxColumnButton[]> | Promise<NzxColumnButton[] | null> {
    if (NzxUtils.isFunction(buttons)) {
      const result = buttons(row, rowIndex, col);
      return resolveValue(result);
    }
    return resolveValue(buttons);
  }
}

function resolveValue(buttons: NzxColumn['buttons']) {
  if (!buttons) {
    return Promise.resolve(null);
  }
  if (NzxUtils.isArray(buttons)) {
    return Promise.resolve(buttons);
  }
  if (NzxUtils.isPromise(buttons) || NzxUtils.isObservable(buttons)) {
    return buttons;
  }
  return Promise.resolve(null);
}
