import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxBetweenComponent } from './between.component';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [NzxBetweenComponent],
  imports: [CommonModule, NzInputModule],
  exports: [NzxBetweenComponent]
})
export class NzxBetweenModule {}
