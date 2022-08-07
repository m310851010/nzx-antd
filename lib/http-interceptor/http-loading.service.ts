import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types'

@Injectable({ providedIn: 'root' })
export class HttpLoadingService {
  private httpLoadingStatus = new Subject<boolean>();

  constructor() {}

  /**
   * HttpLoadingService needs a subject to tell the next loading status.
   * @param statusChangeObservable The subject who tells the loading status.
   */
  init(statusChangeObservable: Observable<boolean>) {
    statusChangeObservable.subscribe(this.httpLoadingStatus);
  }

  /**
   * You have to subscribe the httpLoadingStatus$ in application to set custom loading behaviors through the method.
   * @param observer customer callbacks when http loading status change.
   *
   * @example
   * `app.component.ts`
   * ```ts
   * constructor(private loading: HttpLoadingService){}
   * ngOnInit() {
   *   this.loading.subscribe(status => {
   *     if(status){
   *       this.modal.show('loading...');
   *     }else{
   *       this.modal.hide();
   *     }
   *   })
   * }
   * ```
   */
  subscribe(next?: (value: boolean) => void, error?: (error: NzSafeAny) => void, complete?: () => void): Subscription {
    return this.httpLoadingStatus.subscribe(next, error, complete);
  }
}
