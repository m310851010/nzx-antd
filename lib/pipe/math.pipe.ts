import { Pipe, PipeTransform } from '@angular/core';

/**
 * 调用数学函数 如{{ 5.1 | math: 'ceil' }} => 6
 */
@Pipe({
  name: 'math',
  pure: true
})
export class MathPipe implements PipeTransform {
  transform(value: string | number, fnName: keyof Math, fixed?: number): string | null {
    if (value == null) {
      return null;
    }
    const n: number = typeof value === 'string' ? Number(value) : value;
    // @ts-ignore
    const result = Math[fnName](n);
    return fixed == null ? result : n.toFixed(fixed);
  }
}
