import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Pipe({
  name: 'defaultify',
  pure: true
})
export class DefaultifyPipe implements PipeTransform {
  transform<T = NzSafeAny>(value: T | undefined | null, defaultValue?: T | string): T | string {
    return value == null ? ((defaultValue == null ? '--' : defaultValue) as T) : value;
  }
}
