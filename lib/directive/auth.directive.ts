import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { NzSafeAny } from 'ng-zorro-antd/core/types'

/**
 * 权限指令, 有权限渲染模板,否则渲染else模板
 * @example
 * <button *auth="['code1', 'code2']; else notAuth">有权限时显示</button>
 * <button *auth="'code1'; else notAuth">有权限时显示</button>
 * <ng-template #notAuth>没有权限时显示</ng-template>
 */
@Directive({
  selector: '[auth]'
})
export class AuthDirective<T = unknown> implements OnDestroy {
  /** @internal */
  static authUseIfTypeGuard: void;
  static ngTemplateGuard_auth: 'binding';
  private readonly changeSubscription?: Subscription;
  private authSubscription?: Subscription;

  protected _context: AuthContext<T> = new AuthContext<T>();
  protected _thenTemplateRef: TemplateRef<AuthContext<T>> | null = null;
  protected _elseTemplateRef: TemplateRef<AuthContext<T>> | null = null;
  protected _thenViewRef: EmbeddedViewRef<AuthContext<T>> | null = null;
  protected _elseViewRef: EmbeddedViewRef<AuthContext<T>> | null = null;

  /**
   *
   * 为 `auth` 将要渲染的模板确保正确的上下文类型。
   * 该方法用于向 Ivy 模板类型检查编译器发出信号，即 `auth` 结构化指令会使用特定的上下文类型渲染其模板。
   *
   */
  static ngTemplateContextGuard<T>(
    dir: AuthDirective<T>,
    ctx: NzSafeAny
  ): ctx is AuthContext<Exclude<T, false | 0 | '' | null | undefined>> {
    return true;
  }

  protected hasAuth: Required<NzxAntdService>['hasAuth'] = () => of(true);

  constructor(
    protected _viewContainer: ViewContainerRef,
    public templateRef: TemplateRef<AuthContext<T>>,
    public antdService: NzxAntdService
  ) {
    this._thenTemplateRef = templateRef;

    if (this.antdService.authChange) {
      this.changeSubscription = this.antdService.authChange().subscribe(() => this._updateView());
    }

    if (this.antdService.hasAuth) {
      this.hasAuth = this.antdService.hasAuth;
    }
  }

  /**
   * 布尔表达式，将其作为显示模板的条件进行计算。
   *
   */
  @Input()
  set auth(condition: T) {
    this._context.$implicit = this._context.auth = condition;
    this._updateView();
  }

  /**
   * 当此条件表达式计算为 true 时要显示的模板。
   */
  @Input()
  set authThen(templateRef: TemplateRef<AuthContext<T>> | null) {
    assertTemplate('authThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null; // clear previous view if any.
    this._updateView();
  }

  /**
   * 当此条件表达式计算为 false 时要显示的模板。
   */
  @Input()
  set authElse(templateRef: TemplateRef<AuthContext<T>> | null) {
    assertTemplate('authElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null; // clear previous view if any.
    this._updateView();
  }

  protected _updateView() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = undefined;
    }
    this.authSubscription = this.hasAuth(this._context.$implicit).subscribe(auth => {
      if (this.canRender(auth, this._context.$implicit)) {
        if (!this._thenViewRef) {
          this._viewContainer.clear();
          this._elseViewRef = null;
          if (this._thenTemplateRef) {
            this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
          }
        }
      } else {
        if (!this._elseViewRef) {
          this._viewContainer.clear();
          this._thenViewRef = null;
          if (this._elseTemplateRef) {
            this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
          }
        }
      }
    });
  }

  /**
   * 是否允许渲染
   * @param hasAuth 是否有权限
   * @param value 权限码
   * @protected
   */
  protected canRender(hasAuth: boolean, value: T) {
    return hasAuth;
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

/**
 * @publicApi
 */
export class AuthContext<T = unknown> {
  public $implicit: T = null!;
  public auth: T = null!;
}

function assertTemplate(property: string, templateRef: TemplateRef<NzSafeAny> | null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${templateRef}'.`);
  }
}
