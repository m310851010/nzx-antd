import { Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { IndexAttr, NzxColumn, NzxWidget } from './table.type';
import { TableWidgetService } from './table-widget.service';

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
    private viewContainerRef: ViewContainerRef
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

    const values = Object.assign(params, { props: this.widget.props }, this.widget.props, propValues);
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

    this.widget.onInit?.(callbackParams);

    if (this.widget.onDestroy) {
      componentRef.onDestroy(() =>
        this.widget.onDestroy!({
          ...callbackParams
        })
      );
    }
  }
}
