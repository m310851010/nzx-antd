import { Pipe, PipeTransform } from '@angular/core';
import { IndexAttr, NzxColumn } from '../table.type';
import { of } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'colButtons'
})
export class ColButtonsPipe<T> implements PipeTransform {
  transform(
    buttons: T[] | ((row: NzSafeAny, rowIndex: IndexAttr, column: NzxColumn<NzSafeAny>, parent: NzSafeAny) => T[]),
    row: NzSafeAny,
    rowIndex: IndexAttr,
    column: NzxColumn<NzSafeAny>,
    parent: NzSafeAny
  ) {
    if (!buttons) {
      return of([]);
    }

    if (NzxUtils.isFunction(buttons)) {
      return resolveButton(buttons(row, rowIndex, column, parent));
    }
    return resolveButton(buttons);
  }
}

function resolveButton<T>(buttons: T[]) {
  if (!buttons) {
    return of([]);
  }

  if (NzxUtils.isArray(buttons)) {
    return of(buttons);
  }

  if (NzxUtils.isObservable(buttons) || NzxUtils.isPromise(buttons)) {
    return buttons;
  }
  return of([]);
}
