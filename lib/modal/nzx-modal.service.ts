import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { ConfirmType, ModalOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxModalDragService } from './modal-drag.service';

@Injectable()
export class NzxModalService {
  constructor(
    public modal: NzModalService,
    public modalDragService: NzxModalDragService
  ) {}

  /**
   * 创建对话框, 增加可拖拽功能
   * @param config NzxModalOptions
   */
  create<T, R = NzSafeAny>(config: NzxModalOptions<T, R>): NzModalRef<T, R> {
    return this.createModalWidthDrag(config, c => this.modal.create(c));
  }

  get openModals(): NzModalRef[] {
    return this.modal.openModals;
  }

  get afterAllClosed(): Subject<void> {
    return this.modal._afterAllClosed;
  }

  closeAll(): void {
    this.modal.closeAll();
  }

  confirm<T>(options: NzxModalOptions<T>, confirmType?: ConfirmType): NzModalRef<T> {
    return this.createModalWidthDrag(options, c => this.modal.confirm(c, confirmType));
  }

  info<T>(options: NzxModalOptions<T>): NzModalRef<T> {
    return this.createModalWidthDrag(options, c => this.modal.info(c));
  }

  success<T>(options: NzxModalOptions<T>): NzModalRef<T> {
    return this.createModalWidthDrag(options, c => this.modal.success(c));
  }

  error<T>(options: NzxModalOptions<T>): NzModalRef<T> {
    return this.createModalWidthDrag(options, c => this.modal.error(c));
  }

  warning<T>(options: NzxModalOptions<T>): NzModalRef<T> {
    return this.createModalWidthDrag(options, c => this.modal.warning(c));
  }

  protected createModalWidthDrag<T, R = NzSafeAny>(
    config: NzxModalOptions<T, R>,
    create: (newConfig: NzxModalOptions<T, R>) => NzModalRef<T, R>
  ) {
    const wrapCls = this.modalDragService.getRandomCls();
    const newConfig = this.createModalConfig(config, wrapCls);
    const modalRef = create(newConfig);

    modalRef.afterOpen.subscribe(() => {
      if (config.draggable !== false) {
        const drag = this.modalDragService.createDragHandler(wrapCls, config.nzMask, newConfig.nzModalType);
        modalRef.afterClose.subscribe(() => {
          if (drag && !drag.dropped) {
            drag.dispose();
          }
        });
      }
    });
    return modalRef;
  }

  protected createModalConfig<T, R = NzSafeAny>(config: NzxModalOptions<T, R>, wrapCls: string): NzxModalOptions<T, R> {
    const defaultConfig: NzxModalOptions = {
      nzMaskClosable: false,
      nzTitle: '提示'
    };
    const maskStyle = config.nzMask === false ? { nzMaskStyle: { display: 'none' } } : {};
    const newConfig = Object.assign(defaultConfig, config, maskStyle);
    newConfig.nzWrapClassName = (newConfig.nzWrapClassName || '') + ' ' + wrapCls;
    return newConfig;
  }
}

export interface NzxModalOptions<T = NzSafeAny, D = NzSafeAny, R = NzSafeAny> extends ModalOptions<T, D, R> {
  /**
   * 是否允许拖拽
   */
  draggable?: boolean;
  /**
   * 允许改变窗口大小
   */
  resizable?: boolean;
  /**
   * 允许最大值
   */
  maximum?: boolean;
  /**
   * 允许最小值
   */
  minimum?: boolean;
}
