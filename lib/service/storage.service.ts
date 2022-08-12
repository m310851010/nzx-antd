import { Injectable, Optional } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({
  providedIn: 'root'
})
export class NzxStorageService {
  /**
   * 获取长度
   */
  get length() {
    return this.storage.length;
  }

  constructor(@Optional() public storage: Storage) {
    if (!storage) {
      this.storage = localStorage;
    }
  }

  /**
   * 清除所有数据
   */
  clear() {
    this.storage.clear();
  }

  /**
   * 获取值
   * @param key key
   */
  getItem<T = NzSafeAny>(key: string): T | null {
    const value = this.storage.getItem(key);
    return value == null ? null : (JSON.parse(value) as T);
  }

  /**
   * 获取key
   * @param index 索引
   */
  key(index: number): string | null {
    return this.storage.key(index);
  }

  /**
   * 移除值
   * @param key key
   */
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * 设置值
   * @param key
   * @param value
   */
  setItem<T = NzSafeAny>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }
}
