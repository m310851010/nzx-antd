import { Component, Input } from '@angular/core';
import { IndexAttr, NzxColumn } from '../../table.type';

@Component({
  selector: 'nzx-table-button',
  template: `
    <button
      type="button"
      nz-button
      [type]="props.type || 'button'"
      [nzBlock]="props.nzBlock"
      [nzDanger]="props.nzDanger"
      [nzGhost]="props.nzGhost"
      [nzSize]="props.nzSize || 'small'"
      [nzLoading]="props.nzLoading"
      [nzSearch]="props.nzSearch"
      [nzShape]="props.nzShape"
      [nzType]="props.nzType"
      [disabled]="props.disabled"
      [ngClass]="props.ngClass"
      [ngStyle]="props.ngStyle"
      (click)="props.click && props.click(row, { row, nzData, nzPageData, colIndex, column, indexAttr }, $event)"
    >
      <i *ngIf="props.icon" nz-icon [nzType]="props.icon"></i>
      {{ props.text }}
    </button>
  `
})
export class TableButtonComponent<T> {
  @Input() props: Record<string, any> = {};
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() colIndex!: IndexAttr;
  @Input() column!: NzxColumn<T>;
  @Input() nzData: T[] = [];
  @Input() nzPageData: T[] = [];
}
