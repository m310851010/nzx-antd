import { Inject, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInputComponent } from './table-input/table-input.component';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TableButtonComponent } from './table-button/table-button.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableLinkComponent } from './table-link/table-link.component';
import { LinkHrefPipe } from '../transform/link-href.pipe';
import { TableTagComponent } from './table-tag/table-tag.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TABLE_WIDGET, TableWidget } from '../table.type';
import { NzxSwitchComponent, NzxSwitchModule } from '@xmagic/nzx-antd/switch';
import { NzInputNumberComponent, NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { TableWidgetService } from '@xmagic/nzx-antd/table/table-widget.service';

export function defaultTableWidget(): TableWidget[] {
  return [
    { name: 'switch', component: NzxSwitchComponent },
    { name: 'input', component: TableInputComponent },
    { name: 'number', component: NzInputNumberComponent },
    { name: 'tag', component: TableTagComponent },
    { name: 'button', component: TableButtonComponent },
    { name: 'link', component: TableLinkComponent }
  ];
}

@NgModule({
  declarations: [TableInputComponent, TableButtonComponent, TableLinkComponent, TableTagComponent, LinkHrefPipe],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzInputNumberModule,
    NzxSwitchModule
  ],
  providers: [{ provide: TABLE_WIDGET, useFactory: defaultTableWidget, multi: true }],
  exports: [TableInputComponent, TableButtonComponent, TableLinkComponent, TableTagComponent]
})
export class TableWidgetModule {
  constructor(
    public service: TableWidgetService,
    @Optional() @Inject(TABLE_WIDGET) widgets: TableWidget[][] = []
  ) {
    if (!widgets) {
      return;
    }
    widgets.forEach(c => service.register(c));
  }
}
