import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxAntdService } from '@xmagic/nzx-antd';

@Pipe({
  name: 'defaultify',
  pure: true
})
export class DefaultifyPipe implements PipeTransform {
  constructor(protected antdService: NzxAntdService) {}
  transform<T = NzSafeAny>(value: T | undefined | null, defaultValue?: T | string): T | string {
    return value == null ? ((defaultValue == null ? this.antdService.defaultify || '--' : defaultValue) as T) : value;
  }
}
