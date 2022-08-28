import { NgModule } from '@angular/core';
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

const COMPONENT = [NzxTableComponent, NzxTableHeaderComponent, NzxColumnSettingComponent];
@NgModule({
  declarations: [COMPONENT],
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
    NzButtonModule
  ],
  exports: [COMPONENT]
})
export class NzxTableModule {}
