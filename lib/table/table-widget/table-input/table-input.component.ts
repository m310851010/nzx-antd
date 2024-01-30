import { Component, Input } from '@angular/core';
import { IndexAttr, NzxColumn } from '../../table.type';

@Component({
  selector: 'nzx-table-input',
  template: `
    <input
      nz-input
      [(ngModel)]="props.text"
      (ngModelChange)="props.modelChange && props.modelChange($event, params)"
      autocomplete="off"
      [type]="props.type || 'text'"
      [ngStyle]="props.ngStyle"
      [ngClass]="props.ngClass"
      [nzBorderless]="props.nzBorderless"
      [nzStatus]="props.nzStatus"
      [nzSize]="props.nzSize"
      [disabled]="props.nzDisabled || props.disabled"
      (click)="props.onClick && props.onClick($event, params)"
      (focus)="props.onFocus && props.onFocus($event, params)"
      (blur)="props.onBlur && props.onBlur($event, params)"
      maxlength=""
    />
  `
})
export class TableInputComponent<T> {
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
