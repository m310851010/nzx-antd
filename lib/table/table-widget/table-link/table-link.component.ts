import { Component, Input } from '@angular/core';
import { IndexAttr, NzxColumn, NzxColumnButton } from '../../table.type';

@Component({
  selector: 'nzx-table-link',
  template: `
    <a
      [attr.href]="props | linkHref: row : data : indexAttr : column"
      [attr.target]="props.target"
      [ngClass]="props.ngClass"
      [ngStyle]="props.ngStyle"
      (click)="props.click && !props.disabled && props.click(row, data, indexAttr, $event)"
    >
      {{ props.text }}
    </a>
  `
})
export class TableLinkComponent<T> {
  @Input() props!: NzxColumnButton;
  @Input() data: T[] = [];
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() column!: NzxColumn<T>;
}
