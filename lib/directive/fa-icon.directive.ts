import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';

/**
 * font-awesome 使用指令
 * @
 * <i
 */
@Directive({
  selector: '[fa-icon]',
  exportAs: 'faIcon',
  host: {
    '[class.fa]': `type === 'fa'`,
    '[class.far]': `type === 'far'`,
    '[class.fa-spin]': 'spin === true',
    '[class.fa-pulse]': 'pulse === true',
    '[class.fa-fw]': 'fixedWidth === true',
    '[class.fa-border]': 'border === true',
    '[class.fa-inverse]': 'inverse === true',
    '[class.fa-flip-horizontal]': `flip === 'horizontal'`,
    '[class.fa-flip-vertical]': `flip === 'vertical'`,
    '[class.fa-flip-both]': `flip === 'both'`,
    '[class.fa-pull-left]': `pull === 'left'`,
    '[class.fa-pull-right]': `pull === 'right'`,
    '[class.fa-rotate-90]': `rotate === 90`,
    '[class.fa-rotate-180]': `rotate === 180`,
    '[class.fa-rotate-270]': `rotate === 270`,
    '[class.fa-stack-1x]': `stackItemSize === '1x'`,
    '[class.fa-stack-2x]': `stackItemSize === '2x'`
  }
})
export class FaIconDirective implements OnInit, OnChanges {
  @Input('fa-icon') icon!: string;
  @Input() type: 'far' | 'fa' = 'fa';
  @Input() spin?: boolean;
  @Input() pulse?: boolean;
  @Input() flip?: 'horizontal' | 'vertical' | 'both';
  @Input() pull?: 'left' | 'right';
  @Input() border?: boolean;
  @Input() inverse?: boolean;
  @Input() symbol?: string | boolean;
  @Input() rotate?: 90 | 180 | 270;
  @Input() fixedWidth?: boolean;
  @Input() stackItemSize?: '1x' | '2x';
  @Input() size?: IconSizeType;

  constructor(public render: Renderer2, public element: ElementRef) {}

  ngOnInit(): void {
    this.renderIcon(this.icon);
    this.renderSize(this.size);
  }

  renderIcon(newIcon: string | null, oldIcon?: string | null) {
    if (oldIcon) {
      this.getIconClass(oldIcon).forEach(cls => this.render.removeClass(this.element.nativeElement, cls));
    }
    if (newIcon) {
      this.getIconClass(newIcon).forEach(cls => this.render.addClass(this.element.nativeElement, cls));
    }
  }

  getIconClass(icon: string): string[] {
    return icon ? icon.split(/\s/) : [];
  }

  renderSize(newSize?: IconSizeType, oldSize?: IconSizeType) {
    const newSizeCls = newSize ? `fa-${newSize}` : null;
    const oldSizeCls = oldSize ? `fa-${oldSize}` : null;
    this.renderIcon(newSizeCls, oldSizeCls);
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.icon && !changes.icon.isFirstChange()) {
      this.renderIcon(changes.icon.currentValue, changes.icon.previousValue);
    }

    if (changes.size && !changes.size.isFirstChange()) {
      this.renderSize(changes.size.currentValue, changes.size.previousValue);
    }
  }
}

export type IconSizeType = 'xs' | 'lg' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
