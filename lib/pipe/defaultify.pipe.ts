import { Pipe, PipeTransform } from '@angular/core';
import { Any } from '@xmagic/nzx-antd';

@Pipe({
  name: 'defaultify',
  pure: true
})
export class DefaultifyPipe implements PipeTransform {
  transform<T = Any>(value: T | undefined | null, defaultValue?: T | string): T | string {
    return value == null ? ((defaultValue == null ? '--' : defaultValue) as T) : value;
  }
}
