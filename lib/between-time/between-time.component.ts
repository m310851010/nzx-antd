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
import { Utils } from '@xmagic/nzx-antd/util';

@Component({
  selector: 'nzx-between-time',
  templateUrl: './between-time.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BetweenTimeComponent),
      multi: true
    }
  ]
})
export class BetweenTimeComponent extends NzxBetweenComponent implements ControlValueAccessor {
  nzxValue: DatetimeValueType = {};
  /**
   * 开始字段重命名
   */
  @Input() nzxStartReName = 'start';
  /**
   * 结束字段重命名
   */
  @Input() nzxEndReName = 'end';

  @Input() nzxStartId: string | null = null;
  @Input() nzxStartStatus: NzStatus = '';
  @Input() nzxStartHourStep = 1;
  @Input() nzxStartMinuteStep = 1;
  @Input() nzxStartSecondStep = 1;
  @Input() nzxStartClearText?: string;
  @Input() nzxStartNowText?: string;
  @Input() nzxStartOkText?: string;
  @Input() nzxStartPopupClassName?: string;
  @Input() nzxStartPlaceholder = '起始值';
  @Input() nzxStartAddOn?: TemplateRef<void>;
  @Input() nzxStartDefaultOpenValue?: Date;
  @Input() nzFormat?: string;
  @Input() @InputBoolean() nzxStartUse12Hours = false;
  @Input() nzxStartSuffixIcon?: string | TemplateRef<NzSafeAny>;
  @Input() @InputBoolean() nzxStartHideDisabledOptions?: boolean;
  @Input() @InputBoolean() nzxStartAllowEmpty?: boolean;
  @Input() @InputBoolean() nzxStartAutoFocus?: boolean;
  @Input() nzxStartBackdrop?: boolean;
  @Output() readonly nzxStartOpenChange = new EventEmitter<boolean>();

  @Input() nzxEndId: string | null = null;
  @Input() nzxEndStatus: NzStatus = '';
  @Input() nzxEndHourStep?: number;
  @Input() nzxEndMinuteStep?: number;
  @Input() nzxEndSecondStep?: number;
  @Input() nzxEndClearText?: string;
  @Input() nzxEndNowText?: string;
  @Input() nzxEndOkText?: string;
  @Input() nzxEndPopupClassName?: string;
  @Input() nzxEndPlaceholder = '结束值';
  @Input() nzxEndAddOn?: TemplateRef<void>;
  @Input() nzxEndDefaultOpenValue?: Date;

  @Input() @InputBoolean() nzxEndUse12Hours = false;
  @Input() nzxEndSuffixIcon?: string | TemplateRef<NzSafeAny>;
  @Input() @InputBoolean() nzxEndHideDisabledOptions?: boolean;
  @Input() @InputBoolean() nzxEndAllowEmpty?: boolean;
  @Input() @InputBoolean() nzxEndAutoFocus?: boolean;
  @Input() nzxEndBackdrop?: boolean;
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
      hours = Utils.range(0, minValue.getHours());
    }
    if (maxValue) {
      hours = hours.concat(Utils.range(maxValue.getHours() + 1, 24));
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
      minutes = Utils.range(0, minValue.getMinutes());
    }
    if (maxValue && maxValue.getHours() === hour) {
      minutes = minutes.concat(Utils.range(maxValue.getMinutes() + 1, 60));
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
      seconds = Utils.range(0, minValue.getSeconds());
    }
    if (maxValue && maxValue.getHours() === hour && maxValue.getMinutes() === minute) {
      seconds = seconds.concat(Utils.range(maxValue.getSeconds() + 1, 60));
    }
    return seconds;
  }
}
