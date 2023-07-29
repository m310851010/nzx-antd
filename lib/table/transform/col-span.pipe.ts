import { Pipe, PipeTransform } from '@angular/core';
import { NzxColumn, SpanFunc } from '../table.type';

@Pipe({
  name: 'colSpan',
  pure: true
})
export class ColSpanPipe implements PipeTransform {
  transform<T>(
    row: T,
    spanFunc: SpanFunc<T>,
    nzData: T[],
    nzPageData: T[],
    column: NzxColumn<T>,
    rowIndex: number,
    colIndex: number
  ): unknown {
    let rowspan: number | null | void = 1;
    let colspan: number | null | void = 1;

    if (spanFunc) {
      const result = spanFunc({
        row,
        nzData,
        nzPageData,
        column,
        rowIndex,
        colIndex
      });
      if (Array.isArray(result)) {
        rowspan = result[0];
        colspan = result[1];
      } else if (result != null) {
        rowspan = result!.rowspan;
        colspan = result!.colspan;
      }
    }

    return { rowspan, colspan };
  }
}