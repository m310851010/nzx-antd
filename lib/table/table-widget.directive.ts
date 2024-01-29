import {Directive, Input, ViewContainerRef} from '@angular/core';
import {IndexAttr, NzxColumn} from "./table.type";
import {TableWidgetService} from "./table-widget.service";

@Directive({
  selector: '[table-widget]',
  standalone: true
})
export class TableWidgetDirective<T> {
  @Input() props: Record<string, any> = {};
  @Input() data: T[] = [];
  @Input() row: T = {} as T;
  @Input() indexAttr!: IndexAttr;
  @Input() column!: NzxColumn<T>;

  constructor(private stWidgetRegistry: TableWidgetService, private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    const widget = this.column.widget!;
    const componentType = this.stWidgetRegistry.get(widget.type);

    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(componentType);
    const { row, column } = this;
    const data: { [key: string]: any } = widget.params ? widget.params({ row, column }) : { row };
    Object.keys(data).forEach(key => {
      (componentRef.instance)[key] = data[key];
    });
  }
}
