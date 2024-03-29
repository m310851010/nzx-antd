import { Injectable } from '@angular/core';
import { OptionItem } from '@xmagic/nzx-antd/checkbox';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Any, DicSetting, NzxAntdService } from '@xmagic/nzx-antd';
import { LOADING_ENABLED, SYNCED_ENABLED } from './fetcher.service';
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
  constructor(
    protected http: HttpClient,
    protected antdService: NzxAntdService
  ) {
    this.dicSettings = Object.assign(
      {
        map: (data: { children: { code: string; name: string }[] }) =>
          (data.children || []).map(v => ({ label: v.code, value: v.name, ...v }))
      },
      antdService.dic
    );
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
   * 获取字典项对应的名称
   * @param key 字典key
   * @param itemKey 字典项的key
   */
  getLabel(key: string, itemKey?: string | number) {
    if (itemKey == null) {
      return of(null);
    }
    return this.getDicMap(key, NzxUtils.isNumber(itemKey)).pipe(map(dic => dic[itemKey]));
  }

  /**
   * 同步获取字典项对应的名称
   * @param key 字典key
   * @param itemKey 字典项的key
   */
  getLabelSync(key: string, itemKey?: string | number) {
    if (itemKey == null) {
      return of(null);
    }
    return this.getDicMapSync(key, NzxUtils.isNumber(itemKey))[itemKey];
  }

  /**
   * 获取map{value: label}形式的字典数据, 异步请求, 请求会被缓存 可以多次调用
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDicMap(key: string, isNumber?: boolean): Observable<Record<string, string>> {
    return this.getDic(key, isNumber).pipe(map(list => NzxUtils.listToMap(list, 'value', 'label')));
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
    return NzxUtils.listToMap(this.getDicSync(key, isNumber), 'value', 'label');
  }

  /**
   * 获取map即{value: DicItem}形式的字典数据, 异步请求, 请求会被缓存 可以多次调用
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDicMapItem(key: string, isNumber?: boolean): Observable<Record<string, DicItem>> {
    return this.getDic(key, isNumber).pipe(map(list => NzxUtils.listToMap(list, 'value')));
  }

  /**
   * 获取map即{value: DicItem}形式的字典数据, 同步请求, 请求会被缓存 可以多次调用
   * @param key 字典key
   * @param isNumber 是否是数字
   */
  getDicMapItemSync(key: string, isNumber?: boolean): Record<string, DicItem> {
    return NzxUtils.listToMap(this.getDicSync(key, isNumber), 'value');
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
    const dicMap =
      this.dicSettings.map ||
      ((data?: { children?: { code: string; name: string }[] }, isNumber?: boolean) => {
        return (data?.children || []).map(
          v => ({ ...v, label: v.name, value: isNumber ? +v.code : v.code }) as DicItem
        );
      });
    return this.http
      .get<Record<string, Any>>(url, {
        context: new HttpContext().set(SYNCED_ENABLED, synced).set(LOADING_ENABLED, false)
      })
      .pipe(map(list => dicMap(list, isNumber)));
  }
}

/**
 * 字典项定义, {label: string; value: any}
 */
export type DicItem = Pick<OptionItem, 'label' | 'value'> & { [prop: string]: Any };
