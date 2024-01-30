import { ComponentRef, Directive, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { IndexAttr, NzxColumn, NzxWidget } from './table.type';
import { TableWidgetService } from './table-widget.service';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Directive({
  selector: '[table-widget]'
})
export class TableWidgetDirective<T> implements OnInit {
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() colIndex!: IndexAttr;
  @Input() column!: NzxColumn<T>;
  @Input() nzData: T[] = [];
  @Input() nzPageData: T[] = [];

  @Input() widget!: NzxWidget<T>;

  constructor(
    private widgetService: TableWidgetService,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.viewContainerRef.clear();
    if (!this.widget) {
      return;
    }
    const componentType = this.widgetService.get(this.widget.type);
    if (!componentType) {
      console.warn(`组件类型“${this.widget.type}”未注册`);
      return;
    }

    const params = {
      row: this.row,
      nzData: this.nzData,
      nzPageData: this.nzPageData,
      column: this.column,
      indexAttr: this.indexAttr,
      colIndex: this.colIndex
    };
    console.log(params);
    const componentRef = this.viewContainerRef.createComponent(componentType);
    const propValues: Record<string, any> = this.widget.params ? this.widget.params(this.row, params) : {};

    const values = Object.assign(
      params,
      { props: NzxUtils.extend({}, this.widget.props, propValues) },
      this.widget.props,
      propValues
    );
    Object.assign(componentRef.instance, values);

    for (const key in values) {
      // eslint-disable-next-line
      // @ts-ignore
      const tNode = componentRef._tNode;
      // 检查属性是否有属于inputs, _tNode是私有属性，不应该直接访问，所以做个检查，对实际运行不影响
      if (tNode && tNode.inputs && tNode.inputs[key]) {
        componentRef.setInput(key, values[key]);
      } else {
        componentRef.instance[key] = values[key];
      }
    }

    const callbackParams = {
      instance: componentRef.instance,
      componentRef,
      ...params
    };

    this.mergeElementProperty(componentRef, params);

    this.widget.onInit?.(callbackParams);

    if (this.widget.onDestroy) {
      componentRef.onDestroy(() =>
        this.widget.onDestroy!({
          ...callbackParams
        })
      );
    }
  }

  private mergeElementProperty(
    componentRef: ComponentRef<any>,
    params: {
      indexAttr: IndexAttr;
      column: NzxColumn<T>;
      colIndex: IndexAttr;
      nzData: T[];
      row: T;
      nzPageData: T[];
    }
  ) {
    const element = componentRef.location.nativeElement;
    if (this.widget.style) {
      Object.assign(element.style, this.widget.style);
    }
    if (this.widget.className) {
      element.className = this.widget.className;
    }
    if (this.widget.click) {
      this.renderer.listen(element, 'click', (event: MouseEvent) => this.widget.click!(this.row, params, event));
    }
  }
}
