import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxSwitchComponent } from './switch.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NzxSwitchComponent],
  imports: [CommonModule, FormsModule, NzSwitchModule],
  exports: [NzxSwitchComponent]
})
export class NzxSwitchModule {}
