import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'nzx-between',
  exportAs: 'nzxBetween',
  templateUrl: './between.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NzxBetweenComponent {
  /**
   * 是否禁用
   */
  @Input() nzxDisabled = false;
  /**
   * 控件大小
   */
  @Input() nzxSize: NzSizeLDSType = 'default';
  /**
   * 开始字段禁用
   */
  @Input() nzxStartDisabled = false;
  /**
   * 结束字段禁用
   */
  @Input() nzxEndDisabled = false;
  constructor() {}
}
