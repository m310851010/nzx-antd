import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';

/**
 * 按钮指令，增强nz-button颜色
 * @example
 *
 * <button nz-button nzxColor="success">
 */
@Directive({
  selector: '[nz-button]',
  exportAs: 'nzxButton'
})
export class NzxButtonDirective implements OnInit, OnChanges {
  @Input() nzxColor?: NzxColorType;
  constructor(protected renderer: Renderer2, protected elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.addButtonClass(this.nzxColor);
  }

  /**
   * 添加按钮class 名称
   * @param className class 名称
   * @protected
   */
  protected addButtonClass(className?: NzxColorType): void {
    const element = this.elementRef.nativeElement;
    const classList = element.classList;
    classList.forEach(cls => {
      if (cls.indexOf('nzx-button') === 0) {
        classList.remove(cls);
      }
    });

    if (className) {
      this.renderer.addClass(element, `nzx-button-${className}`);
    }
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.nzxColor && !changes.nzxColor.isFirstChange()) {
      this.addButtonClass(this.nzxColor);
    }
  }
}

export type NzxColorType = 'success' | 'warning' | 'info' | 'error' | 'gray' | 'teal' | string;
