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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DisabledTimeFn,
  CompatibleDate,
  SupportTimeOptions,
  NzDateMode,
  DisabledTimeConfig
} from 'ng-zorro-antd/date-picker';
import { FunctionProp, NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDatePickerI18nInterface } from 'ng-zorro-antd/i18n';
import { NzxBetweenComponent } from '@xmagic/nzx-antd/between';
import { Utils } from '@xmagic/nzx-antd/util';
import {
  DatetimeValueType,
  DisabledDateType,
  getEndDate,
  getEndMonthDate,
  getEndWeekDate,
  getEndYearDate,
  getRealDateTime,
  getStartDate,
  getStartMonthDate,
  getStartWeekDate,
  getStartYearDate,
  getTimeValue
} from './datetime-utils';

@Component({
  selector: 'nzx-between-datetime',
  exportAs: 'nzxBetweenDatetime',
  templateUrl: './between-datetime.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzxBetweenDatetimeComponent),
      multi: true
    }
  ]
})
export class NzxBetweenDatetimeComponent extends NzxBetweenComponent implements ControlValueAccessor {
  nzxValue: DatetimeValueType = {};
  /**
   * 默认配置
   */
  readonly defaultDisabledTime: DisabledTimeConfig = {
    nzDisabledHours: () => [],
    nzDisabledMinutes: () => [],
    nzDisabledSeconds: () => []
  };

  @Input() nzMode?: NzDateMode = 'date';
  /**
   * 开始字段Placeholder
   */
  @Input() nzxStartPlaceholder: string | string[] = '起始值';
  /**
   * 结束字段Placeholder
   */
  @Input() nzxEndPlaceholder: string | string[] = '结束值';

  /**
   * 开始字段重命名
   */
  @Input() nzxStartReName = 'start';
  /**
   * 结束字段重命名
   */
  @Input() nzxEndReName = 'end';

  /**
   * 组件内部 input 的 id 值
   */
  @Input() nzxStartId?: string;

  /**
   * 组件内部 input 的 id 值
   */
  @Input() nzxEndId?: string;
  /**
   * 是否显示清除按钮
   */
  @Input() nzxStartAllowClear?: boolean;

  /**
   * 是否显示清除按钮
   */
  @Input() nzxEndAllowClear?: boolean;
  /**
   * 自动获取焦点
   */
  @Input() nzxStartAutoFocus?: boolean;

  /**
   * 自动获取焦点
   */
  @Input() nzxEndAutoFocus?: boolean;
  /**
   * 浮层是否应带有背景板
   */
  @Input() nzxStartBackdrop?: boolean;

  /**
   * 浮层是否应带有背景板
   */
  @Input() nzxEndBackdrop?: boolean;
  /**
   * 默认面板日期
   */
  @Input() nzxStartDefaultPickerValue?: Date;

  /**
   * 默认面板日期
   */
  @Input() nzxEndDefaultPickerValue?: Date;

  @Input() nzxStartSeparator?: string;
  @Input() nzxEndSeparator?: string;

  @Input() nzxStartShowNow = true;
  @Input() nzxEndShowNow = true;

  @Input() nzShowToday = true;
  @Input() nzxStartShowToday?: boolean;
  @Input() nzxEndShowToday?: boolean;

  @Input() nzShowTime: SupportTimeOptions | boolean = false;
  @Input() nzxStartShowTime?: SupportTimeOptions | boolean;
  @Input() nzxEndShowTime?: SupportTimeOptions | boolean;

  /**
   * 额外的弹出日历 className
   */
  @Input() nzxStartDropdownClassName?: string;

  /**
   * 额外的弹出日历 className
   */
  @Input() nzxEndDropdownClassName?: string;
  /**
   * 展示的日期格式，见nzFormat特别说明
   */
  @Input() nzFormat?: string;

  /**
   * 为 input 标签设置只读属性（避免在移动设备上触发小键盘）
   */
  @Input() nzxStartInputReadOnly?: boolean;

  /**
   * 为 input 标签设置只读属性（避免在移动设备上触发小键盘）
   */
  @Input() nzxEndInputReadOnly?: boolean;
  /**
   * 国际化配置
   */
  @Input() nzLocale?: NzDatePickerI18nInterface;

  /**
   * 额外的弹出日历样式
   */
  @Input() nzxStartPopupStyle?: object;

  /**
   * 额外的弹出日历样式
   */
  @Input() nzxEndPopupStyle?: object;
  /**
   * 在面板中添加额外的页脚
   */
  @Input() nzxStartRenderExtraFooter?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<NzSafeAny> | string>;

  /**
   * 在面板中添加额外的页脚
   */
  @Input() nzxEndRenderExtraFooter?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<NzSafeAny> | string>;
  /**
   * 自定义的后缀图标
   */
  @Input() nzxStartSuffixIcon?: string | TemplateRef<NzSafeAny>;

  /**
   * 自定义的后缀图标
   */
  @Input() nzxEndSuffixIcon?: string | TemplateRef<NzSafeAny>;

  @Input() nzxStartDateRender?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<Date> | string>;
  @Input() nzxEndDateRender?: TemplateRef<NzSafeAny> | string | FunctionProp<TemplateRef<Date> | string>;

  /**
   * 弹出日历和关闭日历的回调
   */
  @Output() nzxStartOnOpenChange = new EventEmitter<boolean>();

  /**
   * 弹出日历和关闭日历的回调
   */
  @Output() nzxEndOnOpenChange = new EventEmitter<boolean>();

  /**
   * OK按钮点击
   */
  @Output() nzxStartOnOk = new EventEmitter<CompatibleDate | null>();

  /**
   * OK按钮点击
   */
  @Output() nzxEndOnOk = new EventEmitter<CompatibleDate | null>();

  /**
   * 待选日期发生变化的回调
   */
  @Output() nzxStartOnCalendarChange = new EventEmitter<(Date | null)[]>();

  /**
   * 待选日期发生变化的回调
   */
  @Output() nzxEndOnCalendarChange = new EventEmitter<(Date | null)[]>();

  /**
   * 待选日期发生变化的回调
   */
  @Output() nzxStartOnPanelChange = new EventEmitter<string | NzDateMode[] | string[]>();

  /**
   * 待选日期发生变化的回调
   */
  @Output() nzxEndOnPanelChange = new EventEmitter<string | NzDateMode[] | string[]>();

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

  private get _defaultStartMaxDateTime(): Date | null {
    return this.nzxValue[this.nzxEndReName];
  }
  private get _defaultEndMinDateTime(): Date | null {
    return this.nzxValue[this.nzxStartReName];
  }

  get startDisabledTime() {
    return this.nzxStartShowTime == null ? this.nzShowTime : this.nzxStartShowTime;
  }

  get endDisabledTime() {
    return this.nzxEndShowTime == null ? this.nzShowTime : this.nzxEndShowTime;
  }

  nzxStartDisabledTime: DisabledTimeFn = current => {
    if (!this.startDisabledTime || !current) {
      return this.defaultDisabledTime;
    }

    const date = current as Date;
    const minValue = getRealDateTime(date, this.startMinDateTime);
    const maxValue = getRealDateTime(
      date,
      this.startMaxDateTime === undefined ? this._defaultStartMaxDateTime : this.startMaxDateTime
    );
    if (!minValue && !maxValue) {
      return this.defaultDisabledTime;
    }
    return this.getDisabledTime(date, minValue, maxValue);
  };

  nzxEndDisabledTime?: DisabledTimeFn = current => {
    if (!this.endDisabledTime || !current) {
      return this.defaultDisabledTime;
    }

    const date = current as Date;
    const minValue = getRealDateTime(
      date,
      this.endMinDateTime === undefined ? this._defaultEndMinDateTime : this.endMinDateTime
    );
    const maxValue = getRealDateTime(date, this.endMaxDateTime);
    if (!minValue && !maxValue) {
      return this.defaultDisabledTime;
    }
    return this.getDisabledTime(date, minValue, maxValue);
  };

  /**
   * 获取禁用的时间部分
   * @param date 当前日期
   * @param minValue 最小日期值
   * @param maxValue 最大日期值
   * @private
   */
  private getDisabledTime(
    date: Date,
    minValue: Date | null | undefined,
    maxValue: Date | null | undefined
  ): DisabledTimeConfig {
    const start = getTimeValue(date, minValue);

    let hours: number[] = [];
    let minutes: number[] = [];
    let seconds: number[] = [];
    if (start) {
      const equalsHour = start.hour === date.getHours();
      hours = Utils.range(0, start.hour);
      minutes = equalsHour ? Utils.range(0, start.minute) : [];
      seconds = equalsHour && start.minute === date.getMinutes() ? Utils.range(0, start.second) : [];
    }

    const end = getTimeValue(date, maxValue);
    if (end) {
      const equalsHour = end.hour === date.getHours();
      hours = hours.concat(Utils.range(end.hour + 1, 24));
      minutes = equalsHour ? minutes.concat(Utils.range(end.minute + 1, 60)) : minutes;
      seconds =
        equalsHour && end.minute === date.getMinutes() ? seconds.concat(Utils.range(end.second + 1, 60)) : seconds;
    }

    return {
      nzDisabledHours: () => hours,
      nzDisabledMinutes: hour => (hour === start?.hour || hour === end?.hour ? minutes : []),
      nzDisabledSeconds: (hour, minute) =>
        (hour === start?.hour && minute === start?.minute) || (hour === end?.hour && minute === end?.minute)
          ? seconds
          : []
    };
  }

  /**
   * 不可选择的日期
   */
  nzxStartDisabledDate: (current: Date) => boolean = date => {
    if (!date) {
      return false;
    }

    const minValue = getRealDateTime(date, this.startMinDateTime);
    const maxValue = getRealDateTime(
      date,
      this.startMaxDateTime === undefined ? this._defaultStartMaxDateTime : this.startMaxDateTime
    );
    if (!maxValue && !minValue) {
      return false;
    }
    // date < min
    if (minValue && this.getDisabledMinDate(date, minValue)) {
      return true;
    }

    // date > max
    if (maxValue && this.getDisabledMaxDate(date, maxValue)) {
      return true;
    }
    return false;
  };

  /**
   * 不可选择的日期
   */
  nzxEndDisabledDate: (current: Date) => boolean = date => {
    if (!date) {
      return false;
    }

    const minValue = getRealDateTime(
      date,
      this.endMinDateTime === undefined ? this._defaultEndMinDateTime : this.endMinDateTime
    );
    const maxValue = getRealDateTime(date, this.endMaxDateTime);
    if (!maxValue && !minValue) {
      return false;
    }

    // date > max
    if (maxValue && this.getDisabledMaxDate(date, maxValue)) {
      return true;
    }

    // date < min
    if (minValue && this.getDisabledMinDate(date, minValue)) {
      return true;
    }

    return false;
  };

  private getDisabledMaxDate(date: Date, maxValue: Date) {
    if (this.nzMode === 'date') {
      if (getStartDate(date) > maxValue.getTime()) {
        return true;
      }
    } else if (this.nzMode === 'week') {
      if (getStartWeekDate(date) > maxValue.getTime()) {
        return true;
      }
    } else if (this.nzMode === 'month') {
      if (getStartMonthDate(date) > maxValue.getTime()) {
        return true;
      }
    } else if (this.nzMode === 'year') {
      if (getStartYearDate(date) > maxValue.getTime()) {
        return true;
      }
    } else {
      return date > maxValue;
    }
    return false;
  }

  private getDisabledMinDate(date: Date, minValue: Date) {
    if (this.nzMode === 'date') {
      if (minValue.getTime() > getEndDate(date)) {
        return true;
      }
    } else if (this.nzMode === 'week') {
      if (minValue.getTime() > getEndWeekDate(date)) {
        return true;
      }
    } else if (this.nzMode === 'month') {
      if (minValue.getTime() > getEndMonthDate(date)) {
        return true;
      }
    } else if (this.nzMode === 'year') {
      if (minValue.getTime() > getEndYearDate(date)) {
        return true;
      }
    } else {
      return minValue > date;
    }
    return false;
  }

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
}
