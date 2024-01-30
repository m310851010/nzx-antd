import { Component, Input } from '@angular/core';
import { IndexAttr, NzxColumn, NzxColumnButton } from '../../table.type';

@Component({
  selector: 'nzx-table-link',
  template: `
    <a
      [attr.href]="props | linkHref: row : params"
      [attr.target]="props.target"
      [ngClass]="props.ngClass"
      [ngStyle]="props.ngStyle"
      (click)="props.click && !props.disabled && props.click(row, params, $event)"
    >
      {{ props.text }}
    </a>
  `
})
export class TableLinkComponent<T> {
  @Input() props!: NzxColumnButton;
  @Input() nzData: T[] = [];
  @Input() nzPageData: T[] = [];
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() colIndex!: IndexAttr;
  @Input() column!: NzxColumn<T>;

  get params() {
    return {
      row: this.row,
      nzData: this.nzData,
      nzPageData: this.nzPageData,
      colIndex: this.colIndex,
      column: this.column,
      indexAttr: this.indexAttr
    };
  }
}
