/**
 * 全局loading
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  readonly loadingId = '__MESSAGE_LOADING__';

  /**
   * 显示loading
   * @param type loading类型
   * @param message 消息
   */
  show(type: 'message' | 'spin' = 'message', message: string = '加载中...') {
    this.showx(this.loadingId, type, () => {
      if (type === 'spin') {
        return `
        <div class="ant-modal-wrap" style="position: fixed; z-index: 999998; background-color: rgba(255, 255, 255, 0.35)"></div>
        <div
          class="ant-spin ant-spin-spinning ant-spin-show-text"
          style="top: 45%; transform: translate(-50%); z-index: 999999; position: fixed; left: 50%"
        >
          <span class="ant-spin-dot ant-spin-dot-spin">
            <i class="ant-spin-dot-item"></i>
            <i class="ant-spin-dot-item"></i>
            <i class="ant-spin-dot-item"></i>
            <i class="ant-spin-dot-item"></i>
          </span>
          <div class="ant-spin-text">${message}</div>
        </div>`;
      }

      return `
      <div class="ant-modal-wrap" style="z-index: 999998;background-color: rgba(255, 255, 255,.35);"></div>
      <div class="ant-message-notice ant-message" style="top: 45%; z-index: 999999;">
        <div class="ant-message-notice-content" style="min-width: 150px;">
          <div class="ant-message-loading">
            <i class="anticon anticon-loading">
              <svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em"
                   class="anticon-spin">
                <path
                  d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
              </svg>
            </i>
            <span>${message}</span>
          </div>
        </div>
      </div>`;
    });
  }

  private showx(id: string, type: 'message' | 'spin', html: () => string) {
    const loading = document.getElementById(id);
    if (loading) {
      if (loading.getAttribute('type') !== type) {
        loading.setAttribute('type', type);
        loading.innerHTML = html();
      }
      loading.style.display = 'block';
      return;
    }
    const div = document.createElement('div');
    div.setAttribute('type', type);
    div.setAttribute('id', id);
    div.innerHTML = html();
    document.body.append(div);
  }

  /**
   * 显示或隐藏loading
   * @param show 是否显示
   */
  loading(show: boolean = true): void {
    show ? this.show() : this.hide();
  }

  /**
   * 隐藏loading
   */
  hide() {
    const loading = document.getElementById(this.loadingId);
    if (loading) {
      loading.style.display = 'none';
    }
  }
}

export const loadingService = new LoadingService();
