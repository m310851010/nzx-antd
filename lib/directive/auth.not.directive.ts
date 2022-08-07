import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { AuthContext, AuthDirective } from './auth.directive';

/**
 * 权限指令, 无权限渲染模板,否则渲染else模板
 * @example
 * <button *auth.not="['code1', 'code2']; else hasAuth">没有有权限时显示</button>
 * <button *auth.not="'code1'; else hasAuth">没有有权限时显示</button>
 * <ng-template #hasAuth>有权限时显示</ng-template>
 */
@Directive({
  selector: '[auth.not]'
})
export class AuthNotDirective<T = unknown> extends AuthDirective {
  /** @internal */
  static authNotUseIfTypeGuard: void;
  static ngTemplateGuard_authNot: 'binding';

  /**
   * 布尔表达式，将其作为显示模板的条件进行计算。
   *
   */
  @Input('auth.not')
  set authNot(condition: T) {
    super.auth = condition;
  }

  /**
   * 当此条件表达式计算为 true 时要显示的模板。
   */
  @Input('auth.notThen')
  set authNotThen(templateRef: TemplateRef<AuthContext<T>> | null) {
    super.authThen = templateRef;
  }

  /**
   * 当此条件表达式计算为 false 时要显示的模板。
   */
  @Input('auth.notElse')
  set authNotElse(templateRef: TemplateRef<AuthContext<T>> | null) {
    super.authElse = templateRef;
  }

  /**
   * 是否允许渲染, 没有权限的时候渲染
   * @param hasAuth 是否有权限
   * @param value 权限码
   * @protected
   */
  protected override canRender(hasAuth: boolean, value: T) {
    return !hasAuth;
  }

  constructor(
    protected override _viewContainer: ViewContainerRef,
    public override templateRef: TemplateRef<AuthContext<T>>,
    public override antdService: NzxAntdService
  ) {
    super(_viewContainer, templateRef, antdService);
  }
}
