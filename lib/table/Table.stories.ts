import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { storyFactory } from '@stories';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzxTableComponent } from './table.component';
import { NzxTableHeaderComponent } from './header/table-header/table-header.component';
import { NzxColumnSettingComponent } from './header/column-setting/column-setting.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzxServiceModule } from '@xmagic/nzx-antd/service';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzxUtils } from '../util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

export default {
  title: '组件/Table 表格',
  component: NzxTableComponent,
  // subcomponents: { NzxTableHeaderComponent, NzxColumnSettingComponent },
  decorators: [
    moduleMetadata({
      declarations: [NzxTableComponent, NzxTableHeaderComponent, NzxColumnSettingComponent],
      imports: [
        NzTableModule,
        NzResizableModule,
        NzIconModule,
        NzPopoverModule,
        NzCheckboxModule,
        DragDropModule,
        NzDividerModule,
        NzDropDownModule,
        NzToolTipModule,
        NzxDirectiveModule,
        NzxPipeModule,
        NzxServiceModule,
        NzOutletModule,
        NzButtonModule
      ]
    })
  ],
  argTypes: {
    api: { table: { type: { required: true } } },
    nzData: { table: { type: { summary: 'Record<string, any>[]' } }, control: { type: 'array' } },
    nzWidthConfig: { table: { type: { summary: 'ReadonlyArray<string | null>' } }, control: { type: 'array' } },
    beforeFetch: {
      table: {
        type: { summary: '(params: Record<string, NzSafeAny>) => Record<string, NzSafeAny> | Promise<NzSafeAny>' }
      }
    },
    afterFetch: {
      table: {
        type: { summary: '(res: NzSafeAny, pageIndex: number) => PageInfo<T> | Promise<PageInfo<T>>' }
      }
    },
    actionVisible: { table: { defaultValue: 'true' } },
    toolbarVisible: { table: { defaultValue: 'true' } },
    nzPageSize: { table: { defaultValue: { summary: '10' } } }
  },
  args: {
    actionVisible: true,
    toolbarVisible: true,
    nzPageSize: 10,
    nzData: [],
    nzWidthConfig: [],
    nzxClickSelectedRow: true
  },
  parameters: {
    controls: {
      exclude: [
        '_allColumns',
        '_bodyColumns',
        '_currentPageData',
        '_headerColumns',
        'defaultPageSizeOptions',
        'sortInfo',
        'ngOnChanges',
        'ngOnInit',
        'nzTable',
        'children',
        '_columnNameChecked',
        '_indeterminate',
        '_nzxColumns',
        '_selectRow'
      ]
    },
    docs: {
      // 传给
      moduleName: '',
      importName: ''
    }
  }
} as Meta;

const Template: (props?: Partial<NzxTableComponent>) => Story<NzxTableComponent> = storyFactory;

const xing = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨'.split('');
const nzData = Array(10)
  .fill(0)
  .map<Record<string, NzSafeAny>>((m, i) => ({
    name: xing[i % xing.length] + '三',
    org: '测试部门',
    firstName: xing[i % xing.length],
    lastName: '六'
  }));

export const Default = Template({
  nzxColumns: [
    { name: 'name', thText: '姓名' },
    { name: 'org', thText: '部门' }
  ],
  nzData: NzxUtils.clone(nzData)
});

export const IsLoading = Template({
  nzLoading: true,
  nzxColumns: [
    { name: 'name', thText: '姓名' },
    { name: 'org', thText: '部门' }
  ]
});

export const IsIndex = Template({
  nzxColumns: [{ isIndex: true }, { name: 'name', thText: '姓名' }, { name: 'org', thText: '部门' }],
  nzData: NzxUtils.clone(nzData)
});

export const IsIndexName = Template({
  nzxColumns: [
    { isIndex: true, thText: '编号' },
    { name: 'name', thText: '姓名' },
    { name: 'org', thText: '部门' }
  ],
  nzData: NzxUtils.clone(nzData)
});

export const NzShowCheckbox = Template({
  nzxColumns: [{ nzShowCheckbox: true }, { name: 'name', thText: '姓名' }, { name: 'org', thText: '部门' }],
  nzData: NzxUtils.clone(nzData).map((v, i) => {
    v.checked = i % 2 == 0;
    return v;
  })
});

export const ColspanHead = Template({
  nzBordered: true,
  nzxColumns: [
    { nzShowCheckbox: true, nzText: '测试' },
    {
      thText: '姓名',
      children: [
        { name: 'firstName', thText: 'FIRST_NAME' },
        { name: 'lastName', thText: 'LAST_NAME' }
      ]
    },
    { name: 'org', thText: '部门' }
  ],
  nzData: NzxUtils.clone(nzData)
});
