import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FetcherService, FetchOptions } from './fetcher.service';
import { Any } from '@xmagic/nzx-antd';
import { HttpErrorBean } from '@xmagic/nzx-antd';

@Injectable()
export class NzxDownloadService {
  constructor(protected fetcher: FetcherService) {}

  /**
   * 下载文件
   * @param options 下载文件配置信息
   */
  download(options: DownloadOption) {
    this.fetcher.fetch<HttpResponse<Blob>>({ ...options, responseType: 'blob', observe: 'response' }).subscribe({
      next: resp => {
        const fn = options.getFileName || this.getFilename.bind(this);
        const filename = fn(resp, options.url);
        if (options.afterDownload && options.afterDownload(resp, filename) === false) {
          return;
        }

        this.saveAs(resp.body!, filename);
        if (options.downloadDone) {
          options.downloadDone(resp, filename);
        }
      },
      error: error => options.downloadError && options.downloadError(error),
      complete: () => options.downloadComplete && options.downloadComplete()
    });
  }

  /**
   * 文件另存为
   * @param body 二进制内容
   * @param filename 文件名
   */
  saveAs(body: Blob, filename: string) {
    if (typeof (window.navigator as Any).msSaveBlob !== 'undefined') {
      (window.navigator as Any).msSaveBlob(body, filename);
      return;
    }

    const blobURL = window.URL.createObjectURL(body as Blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }

  /**
   * 获取文件名称
   * @param resp
   * @param url
   * @protected
   */
  getFilename(resp: HttpResponse<Blob>, url: string): string {
    const headers = resp.headers;
    const disposition = headers.get('content-disposition');
    const filename = headers.get('filename');
    if (filename) {
      return decodeURIComponent(filename.trim());
    } else if (disposition) {
      return disposition
        .split(';')
        .filter(v => v.indexOf('filename=') >= 0)[0]
        .split('=')[1]
        .replace(/(^")|("$)/g, '')
        .trim();
    } else {
      const start = url.lastIndexOf('/') + 1;
      const endIndex = url.lastIndexOf('?');
      const end = endIndex === -1 ? url.length : endIndex;
      return url.substring(start, end);
    }
  }
}

/**
 * 下载文件配置信息
 */
export type DownloadOption = Omit<FetchOptions, 'observe'> & {
  /**
   * 请求完成后的回调
   * @param resp
   * @param filename
   */
  afterDownload?: (resp: HttpResponse<Blob>, filename: string) => boolean | void;

  /**
   * 下载并保存完成的回调
   * @param resp
   * @param filename
   */
  downloadDone?: (resp: HttpResponse<Blob>, filename: string) => void;
  /**
   * 下载发生错误回调
   * @param error
   */
  downloadError?: (error: HttpErrorBean) => void;
  /**
   * 下载结束回调, 不管成功还是失败
   */
  downloadComplete?: () => void;

  /**
   * 获取文件名
   * @param resp 响应对象
   * @param url 请求的url
   */
  getFileName?: (resp: HttpResponse<Blob>, url: string) => string;
};
