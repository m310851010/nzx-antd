import { Component, Input } from '@angular/core';
import { IndexAttr, NzxColumn } from '@xmagic/nzx-antd/table';

@Component({
  selector: 'nzx-table-tag',
  template: `
    <nz-tag
      #instance
      [nzColor]="props.nzColor"
      [nzChecked]="props.nzChecked"
      [nzMode]="props.nzMode"
      (nzOnClose)="props.nzOnClose?.($event, row, params)"
      (nzCheckedChange)="props.nzCheckedChange?.($event, row, params)"
      (click)="props.click && props.click(row, params, $event)"
    >
      {{ props.text }}
    </nz-tag>
  `
})
export class TableTagComponent<T> {
  @Input() props: Record<string, any> = {};
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() colIndex!: IndexAttr;
  @Input() column!: NzxColumn<T>;
  @Input() nzData: T[] = [];
  @Input() nzPageData: T[] = [];

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
