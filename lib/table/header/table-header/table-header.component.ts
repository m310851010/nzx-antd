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
import { NzxTableSize } from '../../table.type';

@Component({
  selector: 'nzx-table-header',
  templateUrl: './table-header.component.html',
  styles: [':host{display: block}'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NzxTableHeaderComponent implements OnInit, OnChanges {
  @Input() tableSize: NzxTableSize = 'small';
  /**
   * 是否显示操作按钮小图标
   */
  @Input() actionVisible?: boolean;
  @Input() refreshVisible?: boolean;
  @Input() resizeVisible?: boolean;

  @Output() tableSizeChange = new EventEmitter<NzTableSize>();
  @Output() refreshClick = new EventEmitter<void>();

  readonly tableSizeOptions = [
    { sizeName: '大号', selected: false, value: 'default' },
    { sizeName: '中等', selected: false, value: 'middle' },
    { sizeName: '紧凑', selected: true, value: 'small' },
    { sizeName: '迷你', selected: true, value: 'mini' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.tableSizeOptions.forEach(v => (v.selected = v.value === this.tableSize));
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.tableSize && !changes.tableSize.isFirstChange()) {
      this.ngOnInit();
    }
  }
}
