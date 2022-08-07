import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types'

@Component({
  selector: 'nzx-checkbox',
  templateUrl: './checkbox.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzxCheckboxComponent),
      multi: true
    }
  ]
})
export class NzxCheckboxComponent<T> extends BaseControl<T[]> implements ControlValueAccessor, OnInit, OnChanges {
  @Input() nzxOptions: NzxCheckboxOption<T>[] = [];
  @Input() override nzxDisabled = false;
  @Output() nzxFocus = new EventEmitter<NzxCheckboxOption<T>>();
  @Output() nzxBlur = new EventEmitter<NzxCheckboxOption<T>>();
  nzxValue: T[] = [];
  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.nzxValue = this.nzxOptions.filter(v => v.checked).map(v => v.value);
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.nzxOptions && !changes.nzxOptions.isFirstChange()) {
      this.writeValue(this.nzxValue);
    }
  }

  ngModelChange(values: T[]) {
    this.nzxValue = values;
    this.onTouched();
    this.onChange(this.nzxValue);
  }

  writeValue(value: T[] | null): void {
    this.nzxValue = value == null ? [] : Array.isArray(value) ? value : [value];
    if (this.nzxOptions && this.nzxOptions.length) {
      this.nzxOptions.forEach(v => (v.checked = this.nzxValue.indexOf(v.value) !== -1));
    }
    this.cdr.markForCheck();
  }
}

/**
 * 数据配置项
 */
export interface NzxCheckboxOption<T =  NzSafeAny> {
  /**
   *
   */
  label: string;
  /**
   * 值
   */
  value: T;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否隐藏
   */
  hide?: boolean;
  /**
   * 是否半选
   */
  indeterminate?: boolean;
  /**
   * 值变化的回调函数
   * @param checked
   */
  ngModelChange?: (checked: boolean) => void;

  [key: string]: NzSafeAny;
}

export type OptionItem = Omit<NzxCheckboxOption, 'indeterminate' | 'ngModelChange'>;
