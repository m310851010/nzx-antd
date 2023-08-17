import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Any } from '@xmagic/nzx-antd';

/**
 * 允许在模板内复用计算值（包含异步），避免重复重新计算。
 * @example
 *
 * <div *let="value1 as v">
 *   <p>{{ v }}</p>
 * </div>
 * <div *let="time$ | async as time">
 *   <p>{{ time }}</p>
 * </div>
 */
@Directive({ selector: '[let]' })
export class LetDirective<T> {
  @Input() let!: T;

  constructor(@Inject(ViewContainerRef) vc: ViewContainerRef, @Inject(TemplateRef) ref: TemplateRef<LetContext<T>>) {
    vc.createEmbeddedView(ref, new LetContext<T>(this));
  }

  static ngTemplateContextGuard<T>(_dir: LetDirective<T>, _ctx: Any): _ctx is LetDirective<T> {
    return true;
  }
}

export class LetContext<T> {
  constructor(private readonly directive: LetDirective<T>) {}

  get $implicit(): T {
    return this.directive.let;
  }

  get let(): T {
    return this.directive.let;
  }
}
