import { Pipe, PipeTransform } from '@angular/core';
import {IndexAttr, NzxColumn, NzxColumnButton} from "@xmagic/nzx-antd/table";
import { NzxUtils } from "@xmagic/nzx-antd/util";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Pipe({
  name: 'colButtonVisible'
})
export class ColButtonVisiblePipe implements PipeTransform {

  transform(value?: NzxColumnButton['visible']): ((row: NzSafeAny, rowIndex: IndexAttr,column: NzxColumn<NzSafeAny>) => boolean | undefined | null | void) {
    if (NzxUtils.isFunction(value)) {
      return value;
    }
    return () => value !== false;
  }
}

