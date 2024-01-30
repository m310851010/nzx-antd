import { Injectable, Type } from '@angular/core';
import { TableWidget, TableWidgetMap } from './table.type';

@Injectable({
  providedIn: 'root'
})
export class TableWidgetService {
  private widgetMap: TableWidgetMap = {};

  get widgets(): TableWidgetMap {
    return this.widgetMap;
  }

  register(widgets?: TableWidget[]): void {
    if (!widgets?.length) {
      return;
    }

    for (const widget of widgets) {
      this.widgetMap[widget.name] = widget.component;
    }
  }

  has(type: string): boolean {
    return Object.hasOwn(this.widgetMap, type);
  }

  get(type: string): Type<any> {
    return this.widgetMap[type];
  }
}
