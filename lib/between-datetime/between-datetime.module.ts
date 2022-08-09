import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxBetweenDatetimeComponent } from './between-datetime.component';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';

@NgModule({
  declarations: [NzxBetweenDatetimeComponent],
  imports: [CommonModule, FormsModule, NzxBetweenModule, NzDatePickerModule],
  exports: [NzxBetweenDatetimeComponent]
})
export class NzxBetweenDatetimeModule {}
