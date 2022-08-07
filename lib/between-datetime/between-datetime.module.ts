import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetweenDatetimeComponent } from './between-datetime.component';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between'

@NgModule({
  declarations: [BetweenDatetimeComponent],
  imports: [CommonModule, FormsModule, NzxBetweenModule, NzDatePickerModule],
  exports: [BetweenDatetimeComponent]
})
export class BetweenDatetimeModule {}
