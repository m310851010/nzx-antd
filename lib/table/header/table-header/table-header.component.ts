import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { NzTableSize } from 'ng-zorro-antd/table';

@Component({
  selector: 'nzx-table-header',
  templateUrl: './table-header.component.html',
  styles: [':host{display: block}'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableHeaderComponent implements OnInit, OnChanges {
  @Input() tableSize: NzTableSize = 'small';
  /**
   * 是否显示操作按钮小图标
   */
  @Input() actionVisible?: boolean;

  @Output() tableSizeChange = new EventEmitter<NzTableSize>();
  @Output() reloadClick = new EventEmitter<void>();

  readonly tableSizeOptions = [
    { sizeName: '大号', selected: false, value: 'default' },
    { sizeName: '中等', selected: false, value: 'middle' },
    { sizeName: '紧凑', selected: true, value: 'small' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.tableSizeOptions.forEach(v => {
      if (v.value === this.tableSize) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    });
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.tableSize && !changes.tableSize.isFirstChange()) {
      this.ngOnInit();
    }
  }
}
