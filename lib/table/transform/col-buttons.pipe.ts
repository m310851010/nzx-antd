import { Pipe, PipeTransform } from '@angular/core';
import { IndexAttr, NzxColumn, NzxColumnButton } from '../table.type';
import { Observable, of } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'colButtons'
})
export class ColButtonsPipe implements PipeTransform {
  transform(
    buttons: NzxColumn['buttons'],
    row: NzSafeAny,
    rowIndex: IndexAttr,
    column: NzxColumn<NzSafeAny>,
    parent: NzSafeAny
  ): Observable<NzxColumnButton[] | null> | Promise<NzxColumnButton[]> {
    if (!buttons) {
      return of([]);
    }

    if (NzxUtils.isFunction(buttons)) {
      return resolveButton(buttons(row, rowIndex, column, parent));
    }
    return resolveButton(buttons);
  }
}

function resolveButton(
  buttons: NzxColumn['buttons']
): Observable<NzxColumnButton[] | null> | Promise<NzxColumnButton[]> {
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
