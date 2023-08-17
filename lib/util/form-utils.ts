import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Any } from '@xmagic/nzx-antd';
import { NzxUtils } from './utils';

/**
 * 表单工具
 */
export class FormUtilsClass {
  /**
   * 遍历表单控件
   * @param form 表单或者表单元素
   * @param callback 回调函数
   */
  forEachFormControl(form: AbstractControl, callback: (ctrl: AbstractControl) => void) {
    if (form instanceof FormGroup) {
      callback(form);
      for (const i in form.controls) {
        const ctrl = form.controls[i];
        if (ctrl instanceof FormControl) {
          callback(ctrl);
        } else {
          this.forEachFormControl(ctrl, callback);
        }
      }
      return;
    }

    if (form instanceof FormArray) {
      callback(form);
      for (let i = 0; i < form.length; i++) {
        const ctrl = form.at(i);
        if (ctrl instanceof FormControl) {
          callback(ctrl);
        } else {
          this.forEachFormControl(ctrl, callback);
        }
      }
      return;
    }

    if (form instanceof FormControl) {
      callback(form);
      return;
    }
  }

  /**
   * 执行验证
   * @param form 表单
   * @param opts 配置
   */
  validate(
    form: AbstractControl,
    opts: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      updateValueAndValidity?: boolean;
    } = { updateValueAndValidity: false }
  ): boolean {
    this.forEachFormControl(form, ctrl => {
      ctrl.markAsDirty(opts);
      opts.updateValueAndValidity && ctrl.updateValueAndValidity(opts);
    });
    return form.valid;
  }

  /**
   * 清空错误信息
   */
  clearError(form: AbstractControl): void {
    this.forEachFormControl(form, ctrl => ctrl.setErrors(null));
  }

  /**
   * 获取错误信息
   * @param control
   */
  getMessage(control: AbstractControl): string | null {
    if (!control.errors) {
      return null;
    }

    for (const key in control.errors) {
      return control.errors[key]?.message || '输入不正确';
    }
    return null;
  }

  /**
   * 必填验证
   * @param message 错误信息
   * @param hasValue 是否有值函数判断
   */
  required<T = Any>(message: string = '不能为空', hasValue: (value: T) => boolean = value => !!value): ValidatorFn {
    return (control: AbstractControl) => {
      return hasValue(control.value) ? null : { required: { message, value: control.value } };
    };
  }

  /**
   * 根据指定函数验证
   * @param operator 操作函数
   * @param errMessage 错误信息
   */
  singleValidator<T>(operator: (value: T) => boolean, errMessage: ValidationErrors): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value == null || control.value.length === 0) {
        return null;
      }
      return operator(control.value) ? null : errMessage;
    };
  }

  /**
   * 根据正则表达式验证
   * @param exp 正则表达式
   * @param message 错误信息
   */
  pattern(exp: RegExp | string, message: string): ValidatorFn {
    const reg = NzxUtils.isString(exp) ? new RegExp(exp, 'mig') : exp;
    return this.singleValidator<string>(v => reg.test(v), { pattern: { message } });
  }

  /**
   * 小于验证
   * @param num 数字
   * @param message 错误信息
   */
  lt(num: number, message: string): ValidatorFn {
    return this.singleValidator<string>(v => Number(v) < num, { lt: { message } });
  }

  /**
   * 小于等于验证
   * @param num 数字
   * @param message 错误信息
   */
  lte(num: number, message: string): ValidatorFn {
    return this.singleValidator<string>(v => Number(v) <= num, { lte: { message } });
  }

  /**
   * 大于验证
   * @param num 数字
   * @param message 错误信息
   */
  gt(num: number, message: string): ValidatorFn {
    return this.singleValidator<string>(v => Number(v) > num, { gt: { message } });
  }

  /**
   * 大于等于验证
   * @param num 数字
   * @param message 错误信息
   */
  gte(num: number, message: string): ValidatorFn {
    return this.singleValidator<string>(v => Number(v) >= num, { gte: { message } });
  }

  /**
   * 包含指定字符串验证
   * @param str 字符串
   * @param ignore 忽略大小写
   * @param message 错误信息
   */
  contains(str: string, ignore: boolean, message: string): ValidatorFn {
    const newStr = ignore ? str.toLowerCase() : str;
    return this.singleValidator<string>(v => (ignore ? v.toLowerCase() : v).indexOf(newStr) !== -1, {
      contains: { message }
    });
  }

  /**
   * min <= x <= max 验证
   * @param min 最小值
   * @param max 最大值
   * @param message 错误信息
   */
  between(min: number, max: number, message: string): ValidatorFn {
    return this.singleValidator<string>(
      value => {
        const v = Number(value);
        return v >= min && v <= max;
      },
      { between: { message } }
    );
  }

  /**
   * 数字校验
   * @param minus 是否允许负数
   * @param fraction 保留小数有效数字位数
   * @param message 错误提示信息
   */
  number(minus?: boolean, fraction?: number, message: string = '数字格式错误'): ValidatorFn {
    return this.singleValidator<string>(value => NzxUtils.isNum(value, minus, fraction), { number: { message } });
  }

  /**
   * 校验手机号（中国）
   * @param message 错误提示信息
   */
  mobile(message: string = '手机号格式错误'): ValidatorFn {
    return this.singleValidator<string>(value => NzxUtils.isMobile(value), { mobile: { message } });
  }

  /**
   * 校验邮箱
   * @param message 错误提示信息
   */
  email(message: string = '邮箱格式错误'): ValidatorFn {
    return this.singleValidator<string>(value => NzxUtils.isEmail(value), { email: { message } });
  }

  /**
   * 校验ip
   * @param message 错误提示信息
   */
  ip(message: string = 'IP格式错误'): ValidatorFn {
    return this.singleValidator<string>(value => NzxUtils.isIp(value), { ip: { message } });
  }

  /**
   * 校验url,支持ip v4, ip v6
   * @param message 错误提示信息
   */
  url(message: string = 'URL格式错误'): ValidatorFn {
    return this.singleValidator<string>(value => NzxUtils.isUrl(value), { url: { message } });
  }

  /**
   * 校验中文
   * @param message 错误提示信息
   */
  chinese(message: string = '只允许输入中文字符'): ValidatorFn {
    return this.singleValidator<string>(value => NzxUtils.isChinese(value), { chinese: { message } });
  }

  /**
   * 验证两个字段
   * @param form 表单
   * @param otherField 另一个被验证的字段名称
   * @param compare 比较器
   * @param errMessage  错误提示
   */
  twoControl(
    form: FormGroup | FormArray | (() => FormGroup | FormArray),
    otherField: Array<string | number> | string,
    compare: (v1: Any, v2: Any) => boolean,
    errMessage: ValidationErrors
  ): ValidatorFn {
    const fn = NzxUtils.isFunction(form) ? form : () => form;
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) {
        return null;
      }

      const other = fn().get(otherField);
      if (!other?.value) {
        return null;
      }

      if (compare(other?.value, control?.value)) {
        if (!other.valid) {
          other.updateValueAndValidity();
        }
        return null;
      }
      return errMessage;
    };
  }

  /**
   * 两个字段相等验证
   * @param form 表单
   * @param otherField 另一个被验证的字段名
   * @param message 提示信息
   */
  equalControl(
    form: FormGroup | FormArray | (() => FormGroup | FormArray),
    otherField: Array<string | number> | string,
    message: string
  ): ValidatorFn {
    const errMessage = { equalValidator: { message } };
    return this.twoControl(form, otherField, (v1, v2) => v1 === v2, errMessage);
  }

  /**
   * 大于另一个字段验证
   * @param form 表单
   * @param otherField 另一个被验证的字段名
   * @param message 提示信息
   */
  gtControl(form: FormGroup | FormArray, otherField: Array<string | number> | string, message: string): ValidatorFn {
    const errMessage = { gtValidator: { message } };
    return this.twoControl(form, otherField, (v1, v2) => Number(v1) > Number(v2), errMessage);
  }

  /**
   * 大于等于另一个字段验证
   * @param form 表单
   * @param otherField 另一个被验证的字段名
   * @param message 提示信息
   */
  gteControl(
    form: FormGroup | FormArray | (() => FormGroup | FormArray),
    otherField: Array<string | number> | string,
    message: string
  ): ValidatorFn {
    const errMessage = { gteValidator: { message } };
    return this.twoControl(form, otherField, (v1, v2) => Number(v1) >= Number(v2), errMessage);
  }

  /**
   * 小于于另一个字段验证
   * @param form 表单
   * @param otherField 另一个被验证的字段名
   * @param message 提示信息
   */
  ltControl(
    form: FormGroup | FormArray | (() => FormGroup | FormArray),
    otherField: Array<string | number> | string,
    message: string
  ): ValidatorFn {
    const errMessage = { ltValidator: { message } };
    return this.twoControl(form, otherField, (v1, v2) => Number(v1) < Number(v2), errMessage);
  }

  /**
   * 小于等于另一个字段验证
   * @param form 表单
   * @param otherField 另一个被验证的字段名
   * @param message 提示信息
   */
  lteControl(
    form: FormGroup | FormArray | (() => FormGroup | FormArray),
    otherField: Array<string | number> | string,
    message: string
  ): ValidatorFn {
    const errMessage = { lteValidator: { message } };
    return this.twoControl(form, otherField, (v1, v2) => Number(v1) <= Number(v2), errMessage);
  }

  /**
   * 唯一验证
   * @param form
   * @param message
   */
  unique(form: FormGroup | FormArray, message: string = '不允许重复'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      for (const c in form.controls) {
        const ctl = form.get(c);
        if (control === ctl) {
          continue;
        }
        if (control.value === ctl?.value) {
          return { uniqueValidator: { message } };
        }
      }
      return null;
    };
  }
}

export const NzxFormUtils = new FormUtilsClass();
