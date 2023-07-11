import { Pipe, PipeTransform } from '@angular/core';
import { NzxColumn, NzxColumnButton } from '../table.type';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxUtils } from '@xmagic/nzx-antd/util';

/**
 * 处理链接的href属性
 */
@Pipe({
  name: 'linkHref'
})
export class LinkHrefPipe implements PipeTransform {
  transform(btn: NzxColumnButton, row: NzSafeAny, data: NzSafeAny[], index: number, col: NzxColumn): unknown {
    if (!btn.href) {
      return undefined;
    }
    if (typeof btn.href === 'string') {
      return btn.href;
    }

    if (NzxUtils.isFunction(btn.href)) {
      return btn.href(row, data, index, col);
    }

    if (row?.buttons && col.name) {
      return row.buttons[col.name]?.href;
    }
    return null;
  }
}
