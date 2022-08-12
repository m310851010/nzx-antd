import { NgModule } from '@angular/core';
import { NzxModalWrapService } from './nz-modal-wrap.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzxModalDragDirective } from './modal-drag.directive';
import { NzxModalDragService } from './modal-drag.service';

@NgModule({
  declarations: [NzxModalDragDirective],
  imports: [NzModalModule],
  exports: [NzxModalDragDirective],
  providers: [NzxModalWrapService, NzxModalDragService]
})
export class NzxModalModule {}
