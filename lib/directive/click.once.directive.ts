import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core/util';

/**
 * 防止重复触发点击
 * @example
 * <button (click.once)="myMethod($event)" [delay]="1000" (originClick)="method($event)">按钮</button>
 */
@Directive({
  selector: '[click.once]'
})
export class ClickOnceDirective {
  constructor() {}

  /**
   * 点击延迟时间(单位:ms)
   */
  @Input() delay = 500;
  @Input() @InputBoolean() disabled = false;
  /**
   * neClick事件
   */
  @Output('click.once') clickEvent = new EventEmitter<MouseEvent>();
  /**
   * 原始点击事件
   * delay - 是否处于延迟状态
   */
  @Output() originClick = new EventEmitter<{ target: MouseEvent; delay: boolean }>();
  private _delayDisabled = false;

  @HostListener('click', ['$event'])
  clickEventHandle(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }

    this.originClick.emit({ target: event, delay: this._delayDisabled });
    if (this._delayDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this._delayDisabled = true;
    setTimeout(() => (this._delayDisabled = false), this.delay);
    this.clickEvent.emit(event);
  }

}
