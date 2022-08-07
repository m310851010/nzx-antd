import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nzx-content',
  template: '<ng-content></ng-content>',
  host: {
    '[class.nzx-page-content]': 'true'
  }
})
export class ContentComponent {
  /**
   * 显示验证占位符(是否显示form-item底部的空白)
   */
  @Input() formItemBottomVisible = true;
  /**
   * margin
   */
  @Input() margin?: string;
  /**
   * margin top
   */
  @Input() marginTop = '10px';

  @HostBinding('class.hide-form-item-bottom') get hideFormItemBottom() {
    return !this.formItemBottomVisible;
  }
  @HostBinding('style.margin') get contentMargin() {
    return this.margin;
  }
  @HostBinding('style.margin-top') get contentMarginTop() {
    return this.marginTop;
  }
  constructor() {}
}
