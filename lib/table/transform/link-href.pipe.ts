import { Pipe, PipeTransform } from '@angular/core';
import { CellArgType, NzxColumnButton } from '../table.type';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxUtils } from '@xmagic/nzx-antd/util';

/**
 * 处理链接的href属性
 */
@Pipe({
  name: 'linkHref'
})
export class LinkHrefPipe implements PipeTransform {
  transform(btn: NzxColumnButton, row: NzSafeAny, params: CellArgType<any>): unknown {
    if (!btn.href) {
      return undefined;
    }
    if (typeof btn.href === 'string') {
      return btn.href;
    }

    if (NzxUtils.isFunction(btn.href)) {
      return btn.href(row, params);
    }

    if (row?.buttons && params.column.name) {
      return row.buttons[params.column.name]?.href;
    }
    return null;
  }
}
