import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';

/**
 * 按钮指令，增强ng-zorro-antd按钮颜色, 和nz-button组件配合使用, 只增加`nzxColor`属性
 *
 * 颜色值取自 https://ant.design/docs/spec/colors-cn
 */
@Directive({
  selector: '[nz-button]',
  exportAs: 'nzxButton'
})
export class NzxButtonDirective implements OnInit, OnChanges {
  /**
   * 按钮颜色名称
   */
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

export type NzxColorType = 'success' | 'warning' | 'info' | 'error' | 'gray' | 'teal' | 'cyan' | string;
