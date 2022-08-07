import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'defaultify'
})
export class DefaultifyPipe implements PipeTransform {
  transform<T = NzSafeAny>(value: T | undefined | null, defaultValue?: T | string): T | string {
    return value == null ? defaultValue || '--' : value;
  }
}
