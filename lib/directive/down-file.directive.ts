import { Directive, HostListener, Input } from '@angular/core';
import { DownloadOption, NzxDownloadService, FetchOptions } from '@xmagic/nzx-antd/service';

@Directive({
  selector: '[down-file]',
  exportAs: 'downFile'
})
export class DownFileDirective {
  /**
   * 下载文件的url
   */
  @Input('down-file') url!: string;
  /**
   * 是否禁用点击下载
   */
  @Input() disabled = false;
  /**
   * 请求方式
   */
  @Input() method: FetchOptions['method'] = 'get';
  /**
   * 请求参数
   */
  @Input() data?: FetchOptions['data'];
  /**
   * 发送之前的回调函数
   */
  @Input() beforeSend?: FetchOptions['beforeSend'];

  /**
   * 请求完成后的回调
   */
  @Input() afterDownload?: DownloadOption['afterDownload'];

  /**
   * 下载并保存完成的回调
   */
  @Input() downloadDone?: DownloadOption['downloadDone'];
  /**
   * 下载发生错误回调
   * @param error
   */
  @Input() downloadError?: DownloadOption['downloadError'];

  /**
   * 获取下载文件名函数
   */
  @Input() getFileName?: DownloadOption['getFileName'];

  constructor(private downloadService: NzxDownloadService) {}

  @HostListener('click', ['$event'])
  clickEventHandler(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.disabled) {
      return;
    }
    this.downloadService.download({
      url: this.url,
      method: this.method,
      data: this.data,
      beforeSend: this.beforeSend,
      afterDownload: this.afterDownload,
      downloadDone: this.downloadDone,
      getFileName: this.getFileName
    });
  }
}
