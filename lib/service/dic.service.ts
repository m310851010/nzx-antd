import { Injectable } from '@angular/core';
import { OptionItem } from '@xmagic/nzx-antd/checkbox';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { DicSetting, NzxAntdService } from '@xmagic/nzx-antd';
import { LOADING_ENABLED, SYNCED_ENABLED } from '@xmagic/nzx-antd/service/fetcher.service';
import { finalize } from 'rxjs/operators';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Injectable({
  providedIn: 'root'
})
export class DicService {
  /**
   * 字典请求缓存, 请求完成会自动删除
   * @private
   */
  private dicMap = new Map<string, Observable<DicItem[]>>();
  /**
   * 字典map缓存数据, 可以通过removeDic删除缓存
   * @private
   */
  private dicMapData = new Map<string, DicItem[]>();
  /**
   * 字典配置
   * @private
   */
  private dicSettings: DicSetting;
  constructor(protected http: HttpClient, protected antdService: NzxAntdService) {
    this.dicSettings = Object.assign({ labelName: 'label', valueName: 'value' }, antdService.dic);
  }

  /**
   * 获取字典, 异步请求
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDic(key: string, isNumber?: boolean): Observable<DicItem[]> {
    if (this.dicMapData.has(key)) {
      return of(this.dicMapData.get(key)!);
    }
    if (this.dicMap.has(key)) {
      return this.dicMap.get(key)!;
    }
    const dic$ = this.fetchDic(key, false, isNumber).pipe(
      shareReplay(1),
      tap(data => this.dicMapData.set(key, data)),
      finalize(() => this.dicMap.delete(key))
    );
    this.dicMap.set(key, dic$);
    return dic$;
  }

  /**
   * 获取map形式的字典数据, 异步请求, 请求会被缓存 可以多次调用
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDicMap(key: string, isNumber?: boolean): Observable<Record<string, string>> {
    return this.getDic(key, isNumber).pipe(map(this.listToMap));
  }

  /**
   * 获取字典, 同步请求  请求会被缓存
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDicSync(key: string, isNumber?: boolean): DicItem[] {
    if (this.dicMapData.has(key)) {
      return this.dicMapData.get(key) || [];
    }
    const data = NzxUtils.getAjaxValue(this.fetchDic(key, true, isNumber));
    this.dicMapData.set(key, data);
    return data;
  }

  /**
   * 获取map形式的字典数据, 同步请求, 请求会被缓存 可以多次调用
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDicMapSync(key: string, isNumber?: boolean): Record<string, string> {
    return this.listToMap(this.getDicSync(key, isNumber));
  }

  /**
   * 删除指定字典key的缓存数据
   * @param key 字典key
   */
  removeDic(key: string): void {
    this.dicMap.delete(key);
    this.dicMapData.delete(key);
  }

  /**
   * 清空所有字典缓存
   */
  clearDic(): void {
    this.dicMap.clear();
    this.dicMapData.clear();
  }

  /**
   * 请求字典数据
   * @param key 字典key
   * @param synced 是否同步
   * @param isNumber 是否数字
   */
  fetchDic(key: string, synced: boolean, isNumber?: boolean) {
    if (!this.dicSettings.url) {
      throw new Error('未配置字典接口地址,请在NzxAntdService中配置"dic"属性的"url"值');
    }
    const url = typeof this.dicSettings.url === 'string' ? `${this.dicSettings.url}/${key}` : this.dicSettings.url(key);
    return this.http
      .get<Record<string, NzSafeAny>[]>(url, {
        context: new HttpContext().set(SYNCED_ENABLED, synced).set(LOADING_ENABLED, false)
      })
      .pipe(
        map(list =>
          (list || []).map(v => {
            const value = v[this.dicSettings.valueName!];
            v.label = v[this.dicSettings.labelName!];
            v.value = isNumber ? +value : value;
            return v as DicItem;
          })
        )
      );
  }

  /**
   * 字典列表转Map结构
   * @param list 字典列表
   */
  listToMap(list: DicItem[]): Record<string, string> {
    const data: Record<string, string> = {};
    for (const v of list) {
      data[v.value] = v.label;
    }
    return data;
  }
}

/**
 * 字典项定义, {label: string; value: any}
 */
export type DicItem = Pick<OptionItem, 'label' | 'value'> & { [prop: string]: NzSafeAny };
