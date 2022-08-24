import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxButtonDirective } from './button.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [NzxButtonDirective],
  imports: [CommonModule, NzButtonModule],
  exports: [NzxButtonDirective, NzButtonModule]
})
export class NzxButtonModule {}
