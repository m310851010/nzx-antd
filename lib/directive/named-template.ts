import { Directive, Input, OnInit, TemplateRef } from '@angular/core';
import { Any } from '@xmagic/nzx-antd';

/**
 * 获取模板名称
 * @example
 * ``` html
 * <ng-template named="test"></ng-template>
 * <ng-template #test named></ng-template>
 *
 * ```
 * ``` javascript
 * @Component(...)
 * export class TestComponent {
 *   @ViewChildren(NamedTemplate) list!: QueryList<NamedTemplate>;
 *
 *   trace() {
 *     this.list.forEach(it => {
 *       console.log(it.named);
 *       console.log(it.template);
 *     });
 *   }
 * }
 * ```
 */
@Directive({
  selector: 'ng-template[named]',
  exportAs: 'namedTemplate'
})
export class NamedTemplate<T> implements OnInit {
  /**
   * 模板名称
   */
  @Input() named!: string;
  constructor(public template: TemplateRef<T>) {}

  ngOnInit(): void {
    this.resolveName();
  }

  resolveName() {
    if (!this.named && this.template) {
      const tplRef = this.template as Any;
      // localNames为数组, 如果没有name则为null
      this.named = tplRef._declarationTContainer.localNames?.[0];
    }
  }
}
