import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzxCheckboxComponent } from './checkbox.component';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';

@NgModule({
  declarations: [NzxCheckboxComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzCheckboxModule, NzOutletModule],
  exports: [NzxCheckboxComponent]
})
export class NzxCheckboxModule {}
