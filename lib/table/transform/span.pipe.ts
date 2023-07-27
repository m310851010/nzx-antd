import { Pipe, PipeTransform } from '@angular/core';
import { NzxColumn, SpanFunc } from '../table.type';

@Pipe({
  name: 'span',
  pure: true
})
export class SpanPipe implements PipeTransform {
  transform<T>(row: T, spanFunc: SpanFunc<T>, column: NzxColumn<T>, rowIndex: number, colIndex: number): unknown {
    let rowspan: number | null | void = 1;
    let colspan: number | null | void = 1;
    const fn = spanFunc;
    if (typeof fn === 'function') {
      const result = fn({
        row,
        column,
        rowIndex,
        colIndex
      });
      if (Array.isArray(result)) {
        rowspan = result[0];
        colspan = result[1];
      } else if (typeof result === 'object') {
        rowspan = result.rowspan;
        colspan = result.colspan;
      }
    }
    return { rowspan, colspan };
  }
}
