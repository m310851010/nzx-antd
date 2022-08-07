import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxBetweenInputComponent } from './between-input.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';

@NgModule({
  declarations: [NzxBetweenInputComponent],
  imports: [CommonModule, FormsModule, NzxBetweenModule, NzInputModule, NzInputNumberModule],
  exports: [NzxBetweenInputComponent]
})
export class NzxBetweenInputModule {}
