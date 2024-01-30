import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CellArgType, NzxColumn } from '../table.type';
import { Observable } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'colFormat'
})
export class ColFormatPipe<T extends Record<string, NzSafeAny>> implements PipeTransform {
  transform(row: T, col: NzxColumn<T>, params: CellArgType<T>): Observable<T> | Promise<T> {
    const nameData = col.name ? NzxUtils.get(row, col.name as string) : null;
    if (!col.format) {
      return Promise.resolve(nameData);
    }
    const result = col.format(nameData, row, params);
    if (NzxUtils.isPromise(result) || NzxUtils.isObservable(result)) {
      return result;
    }
    return Promise.resolve(result);
  }
}
