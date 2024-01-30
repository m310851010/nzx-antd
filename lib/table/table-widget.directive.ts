import { Directive, Input, ViewContainerRef } from '@angular/core';
import { IndexAttr, NzxColumn, NzxWidget } from './table.type';
import { TableWidgetService } from './table-widget.service';

@Directive({
  selector: '[table-widget]'
})
export class TableWidgetDirective<T> {
  @Input() data: T[] = [];
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() column!: NzxColumn<T>;
  @Input() widget!: NzxWidget<T>;

  constructor(
    private stWidgetRegistry: TableWidgetService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.viewContainerRef.clear();
    if (!this.widget) {
      return;
    }
    const componentType = this.stWidgetRegistry.get(this.widget.type);
    if (!componentType) {
      console.warn(`组件类型“${this.widget.type}”未注册`);
      return;
    }

    const componentRef = this.viewContainerRef.createComponent(componentType);
    const data: Record<string, any> = this.widget.params
      ? this.widget.params(this.row, this.indexAttr, this.column, this.data)
      : { row: this.row };

    if (data) {
      Object.assign(componentRef.instance, this.widget.props, data);
    }
  }
}
