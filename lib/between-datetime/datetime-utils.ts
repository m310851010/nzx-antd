import { NzxUtils } from '@xmagic/nzx-antd/util';

export function getStartDate(date: Date) {
  const time = new Date(date.getTime());
  time.setHours(0, 0, 0, 0);
  return time.getTime();
}

export function getEndDate(date: Date) {
  const time = new Date(date.getTime());
  time.setHours(23, 59, 59, 999);
  return time.getTime();
}

export function getStartWeekDate(date: Date) {
  const time = new Date(date.getTime());
  const day = time.getDay();
  time.setDate(time.getDate() - (day === 0 ? 7 : day));
  time.setHours(0, 0, 0, 0);
  return time.getTime();
}

export function getEndWeekDate(date: Date) {
  const time = new Date(date.getTime());
  const day = time.getDay();
  time.setDate(time.getDate() + 7 - (day === 0 ? 7 : day));
  time.setHours(23, 59, 59, 999);
  return time.getTime();
}

export function getStartMonthDate(date: Date) {
  const time = new Date(date.getTime());
  time.setDate(1);
  time.setHours(0, 0, 0, 0);
  return time.getTime();
}

export function getEndMonthDate(date: Date) {
  const time = new Date(date.getTime());
  time.setDate(0);
  time.setHours(23, 59, 59, 999);
  return time.getTime();
}

export function getStartYearDate(date: Date) {
  const time = new Date(date.getTime());
  time.setMonth(1, 1);
  time.setHours(0, 0, 0, 0);
  return time.getTime();
}

export function getEndYearDate(date: Date) {
  const time = new Date(date.getTime());
  time.setMonth(12, 0);
  time.setHours(23, 59, 59, 999);
  return time.getTime();
}

export function getTimeValue(date: Date, value?: Date | null): { hour: number; minute: number; second: number } | null {
  // 检查是否在同一天, 不在同一天不禁用时间
  if (!value || getStartDate(value) !== getStartDate(date)) {
    return null;
  }
  return { hour: value.getHours(), minute: value.getMinutes(), second: value.getSeconds() };
}

/**
 * 获取Datetime 真实值
 * @param date,
 * @param disabledDateType
 */
export function getRealDateTime(date: Date, disabledDateType?: DisabledDateType): Date | null | undefined {
  if (!disabledDateType) {
    return null;
  }
  if (NzxUtils.isFunction(disabledDateType)) {
    return disabledDateType(date);
  }
  if (NzxUtils.isDate(disabledDateType)) {
    return disabledDateType;
  }
  return new Date(disabledDateType);
}

export type DisabledDateType = Date | null | ((current: Date) => Date | null);
export type DatetimeValueType = Record<string, Date | null>;
