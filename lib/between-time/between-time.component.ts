import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { NzSafeAny, NzStatus } from 'ng-zorro-antd/core/types';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzxBetweenComponent } from '@xmagic/nzx-antd/between';
import { DatetimeValueType, DisabledDateType, getRealDateTime } from '@xmagic/nzx-antd/between-datetime';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Component({
  selector: 'nzx-between-time',
  templateUrl: './between-time.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzxBetweenTimeComponent),
      multi: true
    }
  ]
})
export class NzxBetweenTimeComponent extends NzxBetweenComponent implements ControlValueAccessor {
  nzxValue: DatetimeValueType = {};
  get nzDefaultOpenValue() {
    return new Date();
  }

  /**
   * 开始字段重命名
   */
  @Input() nzxStartReName = 'start';
  /**
   * 结束字段重命名
   */
  @Input() nzxEndReName = 'end';
  /**
   * 控件id-开始
   */
  @Input() nzxStartId: string | null = null;
  /**
   * 设置校验状态-开始
   */
  @Input() nzxStartStatus: NzStatus = '';
  /**
   * 小时选项间隔-开始
   */
  @Input() nzxStartHourStep = 1;
  /**
   * 分钟选项间隔-开始
   */
  @Input() nzxStartMinuteStep = 1;
  /**
   * 秒选项间隔-开始
   */
  @Input() nzxStartSecondStep = 1;
  /**
   * 清除按钮的提示文案-开始
   */
  @Input() nzxStartClearText?: string;
  /**
   *  此刻按钮文本
   */
  @Input() nzxStartNowText?: string;
  /**
   * 确认按钮文本
   */
  @Input() nzxStartOkText?: string;
  /**
   * 弹出层类名
   */
  @Input() nzxStartPopupClassName?: string;
  /**
   * 没有值的时候显示的内容
   */
  @Input() nzxStartPlaceholder = '起始值';
  /**
   * 选择框底部显示自定义的内容
   */
  @Input() nzxStartAddOn?: TemplateRef<void>;
  /**
   * 当 [ngModel] 不存在时，可以设置面板打开时默认选中的值
   */
  @Input() nzxStartDefaultOpenValue?: Date;
  /**
   * 展示的时间格式
   */
  @Input() nzFormat = 'HH:mm:ss';
  /**
   * 使用12小时制，为true时format默认为h:mm:ss a
   */
  @Input() @InputBoolean() nzxStartUse12Hours = false;
  /**
   * 自定义的后缀图标
   */
  @Input() nzxStartSuffixIcon?: string | TemplateRef<NzSafeAny>;
  /**
   * 隐藏禁止选择的选项
   */
  @Input() @InputBoolean() nzxStartHideDisabledOptions?: boolean;
  /**
   * 是否展示清除按钮
   */
  @Input() @InputBoolean() nzxStartAllowEmpty?: boolean;
  /**
   * 自动获取焦点
   */
  @Input() @InputBoolean() nzxStartAutoFocus?: boolean;
  /**
   *  浮层是否应带有背景板
   */
  @Input() nzxStartBackdrop?: boolean;
  /**
   * 面板打开/关闭事件
   */
  @Output() readonly nzxStartOpenChange = new EventEmitter<boolean>();

  /**
   * 控件id-结束
   */
  @Input() nzxEndId: string | null = null;
  /**
   * 设置校验状态-结束
   */
  @Input() nzxEndStatus: NzStatus = '';
  /**
   * 小时选项间隔-结束
   */
  @Input() nzxEndHourStep?: number = 1;
  /**
   * 分钟选项间隔-结束
   */
  @Input() nzxEndMinuteStep?: number = 1;
  /**
   * 秒选项间隔-结束
   */
  @Input() nzxEndSecondStep?: number = 1;
  /**
   * 清除按钮的提示文案-结束
   */
  @Input() nzxEndClearText?: string;
  /**
   *  此刻按钮文本
   */
  @Input() nzxEndNowText?: string;
  /**
   * 确认按钮文本
   */
  @Input() nzxEndOkText?: string;
  /**
   * 弹出层类名
   */
  @Input() nzxEndPopupClassName?: string;
  /**
   * 没有值的时候显示的内容
   */
  @Input() nzxEndPlaceholder = '结束值';
  /**
   * 选择框底部显示自定义的内容
   */
  @Input() nzxEndAddOn?: TemplateRef<void>;
  /**
   * 当 [ngModel] 不存在时，可以设置面板打开时默认选中的值
   */
  @Input() nzxEndDefaultOpenValue?: Date;
  /**
   * 使用12小时制，为true时format默认为h:mm:ss a
   */
  @Input() @InputBoolean() nzxEndUse12Hours = false;
  /**
   * 自定义的后缀图标
   */
  @Input() nzxEndSuffixIcon?: string | TemplateRef<NzSafeAny>;
  /**
   * 隐藏禁止选择的选项
   */
  @Input() @InputBoolean() nzxEndHideDisabledOptions?: boolean;
  /**
   * 是否展示清除按钮
   */
  @Input() @InputBoolean() nzxEndAllowEmpty?: boolean;
  /**
   * 自动获取焦点
   */
  @Input() @InputBoolean() nzxEndAutoFocus?: boolean;
  /**
   *  浮层是否应带有背景板
   */
  @Input() nzxEndBackdrop?: boolean;
  /**
   * 面板打开/关闭事件
   */
  @Output() readonly nzxEndOpenChange = new EventEmitter<boolean>();

  /**
   * 最小时间
   */
  @Input() startMinDateTime?: DisabledDateType;

  /**
   * 最大时间
   */
  @Input() endMaxDateTime?: DisabledDateType;

  /**
   * 最大时间
   */
  @Input() startMaxDateTime?: DisabledDateType;

  /**
   * 最小时间
   */
  @Input() endMinDateTime?: DisabledDateType;

  nzxStartDisabledHours = () =>
    this.getDisabledHour(this.startMinDateTime, this.getDefaultMaxValue(this.startMaxDateTime as Date));
  nzxStartDisabledMinutes = (hour: number) =>
    this.getDisabledMinutes(hour, this.startMinDateTime, this.getDefaultMaxValue(this.startMaxDateTime as Date));
  nzxStartDisabledSeconds = (hour: number, minute: number) =>
    this.getDisabledSeconds(
      hour,
      minute,
      this.startMinDateTime,
      this.getDefaultMaxValue(this.startMaxDateTime as Date)
    );

  nzxEndDisabledHours: () => number[] = () =>
    this.getDisabledHour(this.getDefaultMinValue(this.endMinDateTime as Date), this.endMaxDateTime);
  nzxEndDisabledMinutes = (hour: number) =>
    this.getDisabledMinutes(hour, this.getDefaultMinValue(this.endMinDateTime as Date), this.endMaxDateTime);
  nzxEndDisabledSeconds = (hour: number, minute: number) =>
    this.getDisabledSeconds(hour, minute, this.endMinDateTime, this.endMaxDateTime);

  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

  ngModelChange() {
    this.onChange(this.nzxValue);
  }

  writeValue(value: DatetimeValueType): void {
    this.nzxValue = value || {};
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.nzxDisabled = isDisabled;
  }

  registerOnChange(fn: (_: DatetimeValueType) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange: (value: DatetimeValueType) => void = () => null;
  onTouched: () => void = () => null;

  private getDefaultMinValue(date?: Date) {
    return date === undefined ? this.nzxValue[this.nzxStartReName] : date;
  }

  private getDefaultMaxValue(date?: Date) {
    return date === undefined ? this.nzxValue[this.nzxEndReName] : date;
  }

  /**
   * 获取禁用的小时
   * @param minDateTime 最小时间值
   * @param maxDateTime 最大时间值
   * @private
   */
  private getDisabledHour(minDateTime?: DisabledDateType, maxDateTime?: DisabledDateType) {
    const minValue = getRealDateTime(new Date(), minDateTime);
    const maxValue = getRealDateTime(new Date(), maxDateTime);
    if (!maxValue && !minValue) {
      return [];
    }
    let hours: number[] = [];
    if (minValue) {
      hours = NzxUtils.range(0, minValue.getHours());
    }
    if (maxValue) {
      hours = hours.concat(NzxUtils.range(maxValue.getHours() + 1, 24));
    }
    return hours;
  }

  /**
   * 获取禁用的分钟
   * @param hour 当前小时
   * @param minDateTime 最小时间值
   * @param maxDateTime 最大时间值
   * @private
   */
  private getDisabledMinutes(hour: number, minDateTime?: DisabledDateType, maxDateTime?: DisabledDateType) {
    const minValue = getRealDateTime(new Date(), minDateTime);
    const maxValue = getRealDateTime(new Date(), maxDateTime);
    if (!maxValue && !minValue) {
      return [];
    }

    let minutes: number[] = [];
    if (minValue && minValue.getHours() === hour) {
      minutes = NzxUtils.range(0, minValue.getMinutes());
    }
    if (maxValue && maxValue.getHours() === hour) {
      minutes = minutes.concat(NzxUtils.range(maxValue.getMinutes() + 1, 60));
    }
    return minutes;
  }

  /**
   * 获取禁用的秒数
   * @param hour 当前小时
   * @param minute 当前分钟
   * @param minDateTime 最小时间值
   * @param maxDateTime 最大时间值
   * @private
   */
  private getDisabledSeconds(
    hour: number,
    minute: number,
    minDateTime?: DisabledDateType,
    maxDateTime?: DisabledDateType
  ) {
    const minValue = getRealDateTime(new Date(), minDateTime);
    const maxValue = getRealDateTime(new Date(), maxDateTime);
    if (!maxValue && !minValue) {
      return [];
    }

    let seconds: number[] = [];
    if (minValue && minValue.getHours() === hour && minValue.getMinutes() === minute) {
      seconds = NzxUtils.range(0, minValue.getSeconds());
    }
    if (maxValue && maxValue.getHours() === hour && maxValue.getMinutes() === minute) {
      seconds = seconds.concat(NzxUtils.range(maxValue.getSeconds() + 1, 60));
    }
    return seconds;
  }
}
