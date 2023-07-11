import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxColumn } from '../table.type';
import { Observable } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Pipe({
  name: 'colFormat'
})
export class ColFormatPipe implements PipeTransform {
  transform(row: NzSafeAny, col: NzxColumn, index: number): Observable<NzSafeAny> | Promise<NzSafeAny> {
    const nameData = col.name ? NzxUtils.get(row, col.name) : null;
    if (!col.format) {
      return Promise.resolve(nameData);
    }
    const result = col.format(nameData, row, index);
    if (NzxUtils.isPromise(result) || NzxUtils.isObservable(result)) {
      return result;
    }
    return Promise.resolve(result);
  }
}
