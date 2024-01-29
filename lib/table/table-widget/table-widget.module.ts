import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInputComponent } from './table-input/table-input.component';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TableButtonComponent } from './table-button/table-button.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableLinkComponent } from './table-link/table-link.component';
import { LinkHrefPipe } from '../transform/link-href.pipe';

@NgModule({
  declarations: [TableInputComponent, TableButtonComponent, TableLinkComponent, LinkHrefPipe],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  exports: [TableInputComponent, TableButtonComponent, TableLinkComponent]
})
export class TableWidgetModule { }
