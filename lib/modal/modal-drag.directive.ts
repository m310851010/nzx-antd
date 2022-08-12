import { Directive, Host } from '@angular/core';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { NzxModalDragService } from './modal-drag.service';

/**
 * 可拖动的对话框
 * @example
 * ``` html
 * <nz-modal nzxModalDrag ></nz-modal>
 ```
 */
@Directive({
  selector: 'nz-modal[nzxModalDrag]'
})
export class NzxModalDragDirective {
  constructor(@Host() protected modal: NzModalComponent, public modalDragService: NzxModalDragService) {
    const wrapCls = this.modalDragService.getRandomCls();
    modal.afterOpen.subscribe(() => {
      const modelElement = modal.getElement()!;
      if (!modelElement || modelElement.className.indexOf(NzxModalDragService.DRAG_CLS_PREFIX) !== -1) {
        return;
      }

      modelElement.classList.add(wrapCls);
      const drag = this.modalDragService.createDragHandler(wrapCls, modal.nzMask, modal.nzModalType);
      modal.afterClose.subscribe(() => {
        if (drag && !drag.dropped) {
          drag.dispose();
        }
      });
    });
  }
}
