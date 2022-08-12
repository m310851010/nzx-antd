import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Data,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxAntdService } from '@xmagic/nzx-antd';

/**
 * 权限路由守卫服务, 具体数据格式,由NzxAntdService.hasAuth决定处理
 * @example
 * const routes: Routes = [
 * {
 *    path: 'xxx',
 *    canActivate: [ NzxAuthGuardService ],
 *    data: { guard: 'user1', noAuthUrl: '/no-permisseion' }
 * },
 * {
 *    path: 'xxx',
 *    canActivate: [ NzxAuthGuardService ],
 *    data: { guard: { auth: ['user1', 'user2'], noAuthUrl: '/no-permisseion'} }}
 * },
 * {
 *    path: 'yyy',
 *    canActivate: [ NzxAuthGuardService ],
 *    data: { guard: ((router, injector, antdService) => of(true)) as AuthGuardType, noAuthUrl: '/no-permisseion' }
 * }
 * ];
 */
@Injectable({
  providedIn: 'root'
})
export class NzxAuthGuardService implements CanActivate, CanActivateChild, CanLoad {
  protected hasAuth: Required<NzxAntdService>['hasAuth'] = () => of(true);

  constructor(private antdService: NzxAntdService, private router: Router, private injector: Injector) {
    if (this.antdService.hasAuth) {
      this.hasAuth = this.antdService.hasAuth;
    }
  }

  private process(data: Data): Observable<boolean> {
    const guard: AuthGuardType = data.guard;

    if (NzxUtils.isFunction(guard)) {
      return guard(this.router, this.injector, this.antdService);
    }

    return this.hasAuth(guard.auth).pipe(
      tap(auth => {
        const url = guard.noAuthUrl || this.antdService.noAuthUrl;
        if (!auth && url) {
          this.router.navigateByUrl(url);
        }
      })
    );
  }

  // lazy loading
  canLoad(route: Route): Observable<boolean> {
    return this.process(route.data!);
  }

  // all children route
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  // route
  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot | null): Observable<boolean> {
    return this.process(route.data);
  }
}

/**
 * 权限路由守卫 使用函数处理
 */
export type AuthGuardFnType = (router: Router, injector: Injector, antdService: NzxAntdService) => Observable<boolean>;
/**
 * 权限路由守卫配置
 */
export type AuthGuardType<T = NzSafeAny> = AuthGuardFnType | T;
