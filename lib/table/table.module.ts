import {Inject, ModuleWithProviders, NgModule, Optional, Type} from '@angular/core';
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
import { TABLE_WIDGET, TableWidget } from './table.type';
import { TableWidgetService } from './table-widget.service';
import { NzxSwitchComponent, NzxSwitchModule} from '@xmagic/nzx-antd/switch';
import { NzInputNumberComponent, NzInputNumberModule} from 'ng-zorro-antd/input-number';
import { NzTagComponent, NzTagModule } from 'ng-zorro-antd/tag';
import { TableWidgetModule } from './table-widget/table-widget.module';
import { TableButtonComponent } from './table-widget/table-button/table-button.component';
import { TableInputComponent } from './table-widget/table-input/table-input.component';
import { TableLinkComponent } from './table-widget/table-link/table-link.component';

export function defaultTableWidget(): TableWidget[] {
  return [
    { name: 'switch', component: NzxSwitchComponent },
    { name: 'input', component: TableInputComponent },
    { name: 'number', component: NzInputNumberComponent },
    { name: 'tag', component: NzTagComponent },
    { name: 'button', component: TableButtonComponent },
    { name: 'link', component: TableLinkComponent }
  ];
}

const COMPONENT = [NzxTableComponent, NzxTableHeaderComponent, NzxColumnSettingComponent];
@NgModule({
  declarations: [
    COMPONENT,
    ColFormatPipe,
    ColSpanPipe,
    ColButtonVisiblePipe,
    HasAuthPipe,
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
    // 以下是注册的小部件
    NzxSwitchModule,
    NzInputNumberModule,
    NzTagModule,
    TableWidgetModule
  ],
  exports: [COMPONENT]
})
export class NzxTableModule {
  constructor(public service: TableWidgetService, @Optional() @Inject(TABLE_WIDGET) widgets: TableWidget[][] = []) {
    if (!widgets) {
      return;
    }
    widgets.forEach((c) => service.register(c));
  }

  static forRoot(widgets: TableWidget[] = []): ModuleWithProviders<NzxTableModule> {
    return {
      ngModule: NzxTableModule,
      providers: [
        { provide: TABLE_WIDGET, multi: true, useFactory: defaultTableWidget },
        { provide: TABLE_WIDGET, useValue: widgets, multi: true },
      ],
    };
  }

  static forChild(config: TableWidget[] = []): ModuleWithProviders<NzxTableModule> {
    return {
      ngModule: NzxTableModule,
      providers: [
        { provide: TABLE_WIDGET, multi: true, useFactory: defaultTableWidget },
        { provide: TABLE_WIDGET, useValue: config, multi: true },
      ],
    };
  }
}
