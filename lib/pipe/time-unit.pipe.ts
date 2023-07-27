import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeUnit',
  pure: true
})
export class TimeUnitPipe implements PipeTransform {
  transform(value: number | undefined | null, unit: 's' | 'ms'): string | null {
    if (value == null) {
      return null;
    }

    const second = unit === 's' ? value : Math.floor(value / 1000);
    const days = Math.floor(second / 86400);
    const hours = Math.floor((second % 86400) / 3600);
    const minutes = Math.floor(((second % 86400) % 3600) / 60);
    const seconds = Math.floor(((second % 86400) % 3600) % 60);

    const units = ['天', '小时', '分', '秒'];
    const format = [days, hours, minutes, seconds].reduce((str, v, i) => (v ? str + v + units[i] : str), '');
    return format || '0秒';
  }
}
