import { Pipe, PipeTransform } from '@angular/core';
import { CellArgType } from '../table.type';
import { of } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'colButtons'
})
export class ColButtonsPipe<T> implements PipeTransform {
  transform(
    buttons: T[] | ((row: T, params: CellArgType<T> & { parentRow?: T }) => T[]),
    row: T,
    params: CellArgType<T>,
    parentRow?: T
  ) {
    if (!buttons) {
      return of([]);
    }

    if (NzxUtils.isFunction(buttons)) {
      return resolveButton(buttons(row, { ...params, parentRow }));
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
