import { Injectable, InjectionToken, Type } from '@angular/core';

export const TABLE_WIDGET = new InjectionToken<TableWidget[]>('TABLE_WIDGET');

export interface TableWidget {
  name: string;
  component: Type<any>;
}

export type TableWidgetMap = Record<string, Type<any>>;

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
