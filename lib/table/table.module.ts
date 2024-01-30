import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzxTableComponent } from './table.component';
import { NzxTableHeaderComponent } from './header/table-header/table-header.component';
import { NzxColumnSettingComponent } from './header/column-setting/column-setting.component';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzxServiceModule } from '@xmagic/nzx-antd/service';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ColFormatPipe } from './transform/col-format.pipe';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { ColSpanPipe } from './transform/col-span.pipe';
import { ColButtonVisiblePipe } from './transform/col-button-visible.pipe';
import { HasAuthPipe } from './transform/has-auth.pipe';
import { ColButtonsPipe } from './transform/col-buttons.pipe';
import { TableWidgetService, TABLE_WIDGET, TableWidget } from './table-widget.service';

import { TableWidgetModule } from './table-widget/table-widget.module';
import { TableWidgetDirective } from './table-widget.directive';

const COMPONENT = [NzxTableComponent, NzxTableHeaderComponent, NzxColumnSettingComponent];
@NgModule({
  declarations: [
    COMPONENT,
    ColFormatPipe,
    ColSpanPipe,
    ColButtonVisiblePipe,
    HasAuthPipe,
    TableWidgetDirective,
    ColButtonsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzResizableModule,
    NzIconModule,
    NzPopoverModule,
    NzCheckboxModule,
    DragDropModule,
    NzDividerModule,
    NzDropDownModule,
    NzToolTipModule,
    NzxPipeModule,
    NzxServiceModule,
    NzOutletModule,
    NzButtonModule,
    NzxDirectiveModule,
    TableWidgetModule
  ],
  exports: [COMPONENT]
})
export class NzxTableModule {
  constructor(
    public service: TableWidgetService,
    @Optional() @Inject(TABLE_WIDGET) widgets: TableWidget[][] = []
  ) {
    if (!widgets) {
      return;
    }
    widgets.forEach(c => service.register(c));
  }

  static forChild(config: TableWidget[] = []): ModuleWithProviders<NzxTableModule> {
    return {
      ngModule: NzxTableModule,
      providers: [{ provide: TABLE_WIDGET, useValue: config, multi: true }]
    };
  }
}
