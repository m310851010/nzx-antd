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
  SimpleChanges, TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

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
export class NzxCheckboxComponent<T = NzSafeAny>
  extends BaseControl<T[]>
  implements ControlValueAccessor, OnInit, OnChanges
{
  /**
   * checkbox数据源, 根据数据生成 checkbox
   */
  @Input() nzxOptions: NzxCheckboxOption<T>[] = [];
  /**
   * 禁用所有复选框
   */
  @Input() override nzxDisabled = false;
  /**
   * 获取焦点事件
   */
  @Output() nzxFocus = new EventEmitter<NzxCheckboxOption<T>>();
  /**
   * 失去焦点事件
   */
  @Output() nzxBlur = new EventEmitter<NzxCheckboxOption<T>>();
  nzxValue: T[] = [];
  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.nzxValue = (this.nzxOptions || []).filter(v => v.checked).map(v => v.value);
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
export interface NzxCheckboxOption<T = NzSafeAny> {
  /**
   *
   */
  label: string | TemplateRef<NzxCheckboxOption>;
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
  ngModelChange?: (checked: boolean, item: NzxCheckboxOption) => void;

  /**
   * 额外附加数据
   */
  [key: string]: NzSafeAny;
}

export type OptionItem = Omit<NzxCheckboxOption, 'indeterminate' | 'ngModelChange'>;
