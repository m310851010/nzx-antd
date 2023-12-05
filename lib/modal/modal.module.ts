import { NgModule } from '@angular/core';
import { NzxModalService } from './nzx-modal.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzxModalDragDirective } from './modal-drag.directive';
import { NzxModalDragService } from './modal-drag.service';

@NgModule({
  declarations: [NzxModalDragDirective],
  imports: [NzModalModule],
  exports: [NzxModalDragDirective],
  providers: [NzxModalService, NzxModalDragService]
})
export class NzxModalModule {}
