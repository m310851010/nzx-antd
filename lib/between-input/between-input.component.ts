import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzxBetweenComponent } from '@xmagic/nzx-antd/between';

@Component({
  selector: 'nzx-between-input',
  templateUrl: './between-input.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzxBetweenInputComponent),
      multi: true
    }
  ]
})
export class NzxBetweenInputComponent extends NzxBetweenComponent implements ControlValueAccessor {
  nzxValue: InputValueType = {};
  /**
   * 控件类型, 输入框 或 数字框
   */
  @Input() nzxType: 'input' | 'number' = 'input';
  /**
   * 开始字段Placeholder
   */
  @Input() nzxStartPlaceholder = '起始值';
  /**
   * 结束字段Placeholder
   */
  @Input() nzxEndPlaceholder = '结束值';

  /**
   * 最大值-开始
   */
  @Input() nzxStartMax = Infinity;
  /**
   * 最大值-结束
   */
  @Input() nzxEndMax = Infinity;
  /**
   * 最小值-开始
   */
  @Input() nzxStartMin = -Infinity;
  /**
   * 最小值-结束
   */
  @Input() nzxEndMin = -Infinity;
  /**
   * 	数值精度-开始
   */
  @Input() nzxStarPrecision?: number;
  /**
   * 	数值精度-结束
   */
  @Input() nzxEndPrecision?: number;
  /**
   * 	每次改变步数，可以为小数-开始
   */
  @Input() nzxStarStep = 1;
  /**
   * 	每次改变步数，可以为小数-结束
   */
  @Input() nzxEndStep = 1;

  /**
   * 组件内部 input 的 id 值-开始
   */
  @Input() nzxStarId?: string;
  /**
   * 组件内部 input 的 id 值-结束
   */
  @Input() nzxEndId?: string;
  /**
   * 开始字段重命名
   */
  @Input() nzxStartReName?: string;
  /**
   * 结束字段重命名
   */
  @Input() nzxEndReName?: string;

  /**
   * 指定输入框展示值的格式-开始
   */
  @Input() nzxStartFormatter: (value: number | string) => string | number = v => v;
  /**
   * 指定输入框展示值的格式-结束
   */
  @Input() nzxEndFormatter: (value: number | string) => string | number = v => v;

  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

  ngModelChange() {
    this.onChange(this.nzxValue);
  }

  writeValue(value: InputValueType): void {
    this.nzxValue = value || {};
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.nzxDisabled = isDisabled;
  }

  registerOnChange(fn: (_: InputValueType) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange: (value: InputValueType) => void = () => null;
  onTouched: () => void = () => null;
}

export type InputValueType = Record<string, string | number | null> | null;
