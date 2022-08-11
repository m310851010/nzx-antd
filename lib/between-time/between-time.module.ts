import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxBetweenTimeComponent } from './between-time.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { FormsModule } from '@angular/forms';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between'

@NgModule({
  declarations: [NzxBetweenTimeComponent],
  imports: [CommonModule, NzTimePickerModule, FormsModule, NzxBetweenModule],
  exports: [NzxBetweenTimeComponent]
})
export class BetweenTimeModule {}
