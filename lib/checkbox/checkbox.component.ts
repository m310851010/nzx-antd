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
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '@xmagic/nzx-antd/util';
import { NgStyleInterface, NzSafeAny, NgClassType } from 'ng-zorro-antd/core/types';

/**
 * 增强`nz-checkbox`组件, 把数据和值分离
 */
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
  extends BaseControl<T[] | T>
  implements ControlValueAccessor, OnInit, OnChanges
{
  private lastCheckbox?: NzxCheckboxOption<T>;
  /**
   * checkbox数据源, 根据数据生成 checkbox
   */
  @Input() nzxOptions: NzxCheckboxOption<T>[] = [];
  /**
   * 禁用所有复选框
   */
  @Input() override nzxDisabled = false;
  /**
   * 布局方式, 水平/垂直
   */
  @Input() nzxLayout: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * 是否可以多选,默认true
   * 单选状态下(nzxMultiple = false), 值是单个而非数组, 即 <nzx-checkbox [(ngModel)]="test"></nzx-checkbox> // test = 1
   * 多选状态下(nzxMultiple = true),值是数组, 即 <nzx-checkbox [(ngModel)]="test"></nzx-checkbox> // test = [1]
   */
  @Input() nzxMultiple = true;
  /**
   * 是否必填,在单选状态下(即nzxMultiple = false),是否必须要选一个
   *
   */
  @Input() nzxRequired = true;
  /**
   * 所有label的模板
   */
  @Input() nzxLabelTemplate?: TemplateRef<{ $implicit: NzxCheckboxOption<T>; options: NzxCheckboxOption<T>[] }>;
  /**
   * 获取焦点事件
   */
  @Output() nzxFocus = new EventEmitter<NzxCheckboxOption<T>>();
  /**
   * 失去焦点事件
   */
  @Output() nzxBlur = new EventEmitter<NzxCheckboxOption<T>>();
  /**
   * 单个点击事件
   */
  @Output() nzxItemChange = new EventEmitter<NzxCheckboxOption<T>>();
  nzxValue: T[] = [];
  private canValueChange = true;
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

  ngModelChange(values: T[]): void {
    if (!this.canValueChange) {
      return;
    }
    if (!this.nzxMultiple && this.lastCheckbox && values.length > 1) {
      values = values.filter(v => v === this.lastCheckbox!.value);
    }
    this.nzxValue = values;
    this.onTouched();
    this.onChange(!this.nzxMultiple ? this.nzxValue[0] : this.nzxValue);
  }

  onItemChange(checked: boolean, item: NzxCheckboxOption<T>) {
    item.indeterminate = false;
    this.canValueChange = true;
    if (!this.nzxMultiple) {
      // 取消上一次选中
      if (checked && this.lastCheckbox && this.lastCheckbox !== item) {
        this.lastCheckbox.checked = false;

        // 单选模式必须选中一个
      } else if (!checked && this.lastCheckbox === item && this.nzxRequired) {
        this.canValueChange = false;
        // 改为选中状态, 同时禁止触发ngModelChange
        setTimeout(() => {
          item.checked = true;
          this.canValueChange = true;
          this.cdr.markForCheck();
        });
        return;
      }
      this.lastCheckbox = item;
    }
    if (item?.ngModelChange) {
      item.ngModelChange(checked, item);
    }
    this.nzxItemChange.emit(item);
  }

  writeValue(value: T[] | T | null): void {
    this.nzxValue = value == null ? [] : Array.isArray(value) ? value : [value];
    if (this.nzxOptions && this.nzxOptions.length) {
      if (!this.nzxMultiple && this.nzxValue.length > 1) {
        this.nzxValue.splice(1, this.nzxValue.length - 1);
      }

      this.nzxOptions.forEach(v => {
        v.checked = this.nzxValue.indexOf(v.value) !== -1;
        if (!this.nzxMultiple && v.checked) {
          this.lastCheckbox = v;
        }
      });
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
   * 样式
   */
  ngStyle?: NgStyleInterface;
  /**
   * class 样式
   */
  ngClass?: NgClassType;

  /**
   * 包裹CheckBox样式, 垂直布局有效
   */
  wrapperNStyle?: NgStyleInterface;
  /**
   * class 包裹CheckBox样式, 垂直布局有效
   */
  wrapperNgClass?: NgClassType;

  /**
   * 额外附加数据
   */
  [key: string]: NzSafeAny;
}

export type OptionItem = Omit<NzxCheckboxOption, 'indeterminate' | 'ngModelChange'>;
