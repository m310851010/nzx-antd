import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FetcherService, FetchOptions } from './fetcher.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types'

@Injectable()
export class DownloadService {
  constructor(protected fetcher: FetcherService) {}

  /**
   * 下载文件
   * @param options 下载文件配置信息
   */
  download(options: DownloadOption) {
    this.fetcher
      .fetch<HttpResponse<Blob>>({ ...options, responseType: 'blob', observe: 'response' })
      .subscribe(resp => {
        const url = options.url;
        const filename = this.getFilename(resp.headers, url);
        if (options.afterDownload && options.afterDownload(resp, filename) === false) {
          return;
        }

        this.saveAs(resp.body!, filename);
        if (options.downloadDone) {
          options.downloadDone(resp, filename);
        }
      });
  }

  /**
   * 文件另存为
   * @param body 二进制内容
   * @param filename 文件名
   */
  saveAs(body: Blob, filename: string) {
    if (typeof (window.navigator as NzSafeAny).msSaveBlob !== 'undefined') {
      (window.navigator as NzSafeAny).msSaveBlob(body, filename);
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
   * @param headers
   * @param url
   * @protected
   */
  protected getFilename(headers: HttpHeaders, url: string): string {
    const disposition = headers.get('content-disposition');
    const filename = headers.get('filename');
    if (filename) {
      return decodeURIComponent(filename);
    } else if (disposition) {
      return disposition.split(';')[0].split('=')[1];
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
};
