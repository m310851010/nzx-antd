import { Component, HostBinding, Input } from '@angular/core';
import { isContentEmpty } from './is-content-empty';

@Component({
  selector: 'nzx-header',
  template: `
    <div class="page-header_row">
      <div class="page-header_col">
        <ng-content></ng-content>
      </div>
      <div
        #divElement
        (cdkObserveContent)="contentChanged(divElement)"
        [debounce]="200"
        [class.header-content-wrapper]="hasContent"
      >
        <ng-content select="[buttons]"></ng-content>
      </div>
    </div>
  `,
  host: {
    '[class.nzx-page-header]': 'true'
  }
})
export class NzxHeaderComponent {
  hasContent = false;
  /**
   * 显示验证占位符(是否显示form-item底部的空白)
   */
  @Input() hasBottom = false;
  /**
   * 是否显示按钮区域
   */
  @Input() buttonsVisible = true;
  @HostBinding('class.hide-form-item-bottom') get hideFormItemBottom() {
    return !this.hasBottom;
  }

  constructor() {}

  contentChanged(element: HTMLElement) {
    this.hasContent = !isContentEmpty(element);
  }
}
