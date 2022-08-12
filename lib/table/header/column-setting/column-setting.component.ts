import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkDragDrop, CdkDragRelease, CdkDragStart } from '@angular/cdk/drag-drop/drag-events';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzxColumn } from '../../table.type';

/**
 * 列设置
 * 注意: 只在表头不分组的情况下有效
 */
@Component({
  selector: 'nzx-column-setting',
  templateUrl: './column-setting.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NzxColumnSettingComponent<T> implements OnInit /*, OnChanges*/ {
  _nzxColumns: NzxColumn<T>[] = [];
  _columnNameChecked!: boolean | null;
  _indeterminate!: boolean | null;

  /**
   * 拖拽预览样式
   */
  @Input() dragPreviewClass = 'nzx-column-setting__drag-preview';
  /**
   * 显示列名
   */
  @Input() columnNameVisible: boolean | null = true;

  @Input() set nzxColumns(value: NzxColumn<T>[]) {
    if (value) {
      this._nzxColumns = value;
      this.refreshNameCheckedStatus();
    }
  }
  get nzxColumns() {
    return this._nzxColumns;
  }

  /**
   * 当个列选中事件
   */
  @Output() columnCheckedChange = new EventEmitter<NzxColumn<T>>();
  /**
   * 排序列触发
   */
  @Output() sortedColumn = new EventEmitter<CdkDragDrop<NzxColumn<T>, NzSafeAny>>();
  /**
   * 列名选择Change
   */
  @Output() columnNameCheckedChange = new EventEmitter<boolean>();

  /**
   * 固定列
   */
  @Output() fixedClick = new EventEmitter<NzxColumn<T>>();

  constructor(protected renderer: Renderer2) {}

  ngOnInit(): void {}

  columnVisible(item: NzxColumn<T>, checked: boolean) {
    this.refreshNameCheckedStatus();
    this.columnCheckedChange.emit(item);
  }

  /**
   * 固定列
   * @param column
   * @param fixed
   */
  fixedColumn(column: NzxColumn<T>, fixed?: 'left' | 'right') {
    if (column.fixed === fixed) {
      return;
    }
    column.fixed = fixed;
    this.fixedClick.emit(column);
  }

  /**
   * 拖动列排序
   * @param event
   * @param list 排序数组
   */
  dropColumn(event: CdkDragDrop<NzxColumn<T>, NzSafeAny>, list: NzxColumn<T>[]) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.sortedColumn.emit(event);
  }

  /**
   * 开始拖动
   * @param event
   */
  cdkDragStarted(event: CdkDragStart) {
    const preview = new ElementRef<HTMLElement>(document.querySelector('.cdk-drag.cdk-drag-preview')!);
    this.renderer.addClass(preview.nativeElement, this.dragPreviewClass);
  }

  /**
   * 结束拖动
   * @param event
   */
  cdkDragReleased(event: CdkDragRelease) {
    const preview = new ElementRef<HTMLElement>(document.querySelector('.cdk-drag.cdk-drag-preview')!);
    this.renderer.removeClass(preview.nativeElement, this.dragPreviewClass);
  }

  /**
   * 展示列复选框 checked
   * @param checked
   */
  columnNameChange(checked: boolean) {
    if (this._nzxColumns && this._nzxColumns.length) {
      this._columnNameChecked = checked;
      this._indeterminate = false;
      this._nzxColumns.filter(v => v.settingVisible && v.settingDisabled !== true).forEach(v => (v.visible = checked));
      this.columnNameCheckedChange.emit(checked);
    }
  }

  /**
   * 更新展示列状态
   */
  refreshNameCheckedStatus(): void {
    if (this._nzxColumns && this._nzxColumns.length) {
      const list = this._nzxColumns.filter(v => v.settingVisible && v.settingDisabled !== true);
      this._columnNameChecked = list.every(item => item.visible);
      this._indeterminate = !this._columnNameChecked && list.some(item => item.visible);
    } else {
      this._columnNameChecked = false;
      this._indeterminate = false;
    }
  }
}
