import { ChangeDetectionStrategy, Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzSafeAny, NzSizeDSType } from 'ng-zorro-antd/core/types';
import { BaseControl } from '@xmagic/nzx-antd/util';

@Component({
  selector: 'nzx-switch',
  template: `
    <nz-switch
      [(ngModel)]="nzxValue"
      [nzCheckedChildren]="nzCheckedChildren"
      [nzUnCheckedChildren]="nzUnCheckedChildren"
      [nzDisabled]="nzDisabled"
      [nzSize]="nzSize"
      [nzLoading]="nzLoading"
      [nzControl]="nzControl"
      (ngModelChange)="ngModelChange($event)"
      (click)="onTouched()"
      (focus)="onTouched()"
    ></nz-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzxSwitchComponent),
      multi: true
    }
  ]
})
export class NzxSwitchComponent extends BaseControl<NzSafeAny> implements ControlValueAccessor {
  nzxValue!: boolean;
  /**
   * 选中时的值
   */
  @Input() nzxCheckedValue: NzSafeAny = true;
  /**
   * 非选中时的值
   */
  @Input() nzxUnCheckedValue: NzSafeAny = false;
  /**
   * 	disable 状态
   */
  @Input() nzDisabled?: boolean;
  /**
   * 	加载中的开关
   */
  @Input() nzLoading?: boolean;
  /**
   * 	是否完全由用户控制状态, Switch 的状态完全由用户接管，不再自动根据点击事件改变数据。
   */
  @Input() nzControl?: boolean;
  /**
   * 选中时的内容
   */
  @Input() nzCheckedChildren?: string | TemplateRef<void>;
  /**
   * 非选中时的内容
   */
  @Input() nzUnCheckedChildren?: string | TemplateRef<void>;
  /**
   * 开关大小
   */
  @Input() nzSize?: NzSizeDSType;

  ngModelChange(val: boolean) {
    this.onChange(val ? this.nzxCheckedValue : this.nzxUnCheckedValue);
  }

  writeValue(value: NzSafeAny | null): void {
    this.nzxValue = value === this.nzxCheckedValue;
  }

  override setDisabledState(isDisabled: boolean): void {
    this.nzDisabled = isDisabled;
  }
}
