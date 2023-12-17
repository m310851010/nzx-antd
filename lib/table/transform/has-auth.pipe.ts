import { Pipe, PipeTransform } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'hasAuth'
})
export class HasAuthPipe implements PipeTransform {
  protected hasAuth: Required<NzxAntdService>['hasAuth'] = () => of(true);
  constructor(public antdService: NzxAntdService) {
    if (this.antdService.hasAuth) {
      this.hasAuth = this.antdService.hasAuth;
    }
  }

  transform(value: NzSafeAny): Observable<boolean> {
    return this.hasAuth(value);
  }
}
