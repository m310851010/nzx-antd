import { InputType } from '@storybook/csf';
// 控件类型
// https://storybook.js.org/docs/angular/essentials/controls
export const EXCLUDE_PARAMS = [
  'nzxValue',
  'setDisabledState',
  'registerOnChange',
  'registerOnTouched',
  'onChange',
  'onTouched',
  'writeValue',
  'ngModelChange'
];

export const SIZE_ARG_TYPE = {
  control: 'inline-radio',
  options: ['large', 'default', 'small'],
  defaultValue: 'default'
};

export const HIDE_CONTROL = {
  table: { defaultValue: { summary: null } },
  defaultValue: null,
  control: false
};

/**
 * 隐藏指定属性的control,　属性不隐藏
 * @param props 属性名称列表
 */
export function hideControlArgType<T>(...props: (keyof T)[]): Record<string, InputType> {
  return props.reduce((prev, curr) => {
    prev[curr] = { ...HIDE_CONTROL };
    return prev;
  }, {} as Record<keyof T, InputType>);
}
