import { Component, Input } from '@angular/core';
import { IndexAttr, NzxColumn} from "../../table.type";

@Component({
  selector: 'nzx-table-input',
  template: `<input nz-input [(ngModel)]="props.text" autocomplete="off"
                    [type]="props.type || 'text'"
                    [ngStyle]="props.ngStyle"
                    [ngClass]="props.ngClass"
                    [nzBorderless]="props.nzBorderless"
                    [nzStatus]="props.nzStatus"
                    [nzSize]="props.nzSize"
                    [disabled]="props.nzDisabled || props.disabled"
                    (click)="props.onClick && props.onClick($event)"
                    (focus)="props.onFocus && props.onFocus($event)"
                    (blur)="props.onBlur && props.onBlur($event)"
                    maxlength="">`
})
export class TableInputComponent<T> {
  @Input() props: Record<string, any> = {};
  @Input() data: T[] = [];
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() column!: NzxColumn<T>;
}
