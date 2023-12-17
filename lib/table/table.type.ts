import { TemplateRef } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableFilterFn, NzTableSize, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { NzButtonShape, NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

/**
 * 列配置
 */
export interface NzxColumn<T = Record<string, NzSafeAny>> {
  thText?: string;
  /**
   * th内容自定义, 不包含th标签本身
   */
  thTemplate?: string | TemplateRef<T>;

  /**
   * 字段名称
   */
  name?: keyof T | string;
  /**
   * td自定义渲染模版, string
   */
  tdTemplate?: string | TemplateRef<T>;
  /**
   * 是否为序号
   */
  isIndex?: boolean;
  /**
   * 格式化列数据
   * @param data 当前字段数据
   * @param row 行数据
   * @param index 行索引
   */
  format?: (data: NzSafeAny, row: T, index: number) => Observable<NzSafeAny> | Promise<NzSafeAny> | NzSafeAny;
  thNgClass?: NzxClassType | ((col: NzxColumn<T>, colIndex: number) => NzxClassType);
  thNgStyle?: NzxStyleType | ((col: NzxColumn<T>, colIndex: number) => NzxStyleType);
  tdNgClass?: NzxClassType | ((col: NzxColumn<T>, colIndex: number) => NzxClassType);
  tdNgStyle?: NzxStyleType | ((col: NzxColumn<T>, colIndex: number) => NzxStyleType);
  tdClassName?: NzxClassType | ((row: T, rowIndex: number, col: NzxColumn<T>, colIndex: number) => NzxClassType);
  tdStyle?: NzxStyleType | ((row: T, rowIndex: number, col: NzxColumn<T>, colIndex: number) => NzxStyleType);

  /**
   * 用于分组表头
   */
  children?: NzxColumn<T>[];

  /**
   * nzShowCheckbox为true, 默认启用enableCheckAll
   */
  enableCheckAll?: boolean;
  /**
   * 是否显示复选框
   */
  nzShowCheckbox?: boolean;
  /**
   * 是否显示全选
   */
  nzShowCheckAll?: boolean;
  nzDisabled?: boolean;
  nzIndeterminate?: boolean;
  checked?: boolean;
  thCheckedChange?: (value: boolean, col: NzxColumn<T>) => void;
  tdCheckedChange?: (value: boolean, col: NzxColumn<T>, row: T, rowIndex: IndexAttr) => void;
  nzShowRowSelection?: boolean;
  nzSelections?: Array<{
    text: string;
    onSelect(...args: NzSafeAny[]): NzSafeAny;
  }>;
  nzShowSort?: boolean;
  nzSortPriority?: boolean;
  nzSortFn?: NzTableSortFn<T> | boolean | null;
  nzSortDirections?: NzTableSortOrder[];
  nzSortOrder?: NzTableSortOrder;
  nzSortOrderChange?: (value: NzTableSortOrder, col: NzxColumn<T>) => void;
  nzColumnKey?: string;

  nzShowFilter?: boolean;
  nzCustomFilter?: boolean;
  nzFilterFn?: NzTableFilterFn<T> | boolean;
  nzFilterMultiple?: boolean;
  nzFilters?: Array<{ text: string; value: NzSafeAny; byDefault?: boolean }>;
  nzFilterChange?: (value: NzSafeAny[] | NzSafeAny, nzData: T[]) => void;

  nzWidth?: string | null;
  thAlign?: 'left' | 'right' | 'center';
  tdAlign?: 'left' | 'right' | 'center';
  nzBreakWord?: boolean;
  nzEllipsis?: boolean;
  nzExpandChange?: (expand: boolean, col: NzxColumn<T>, row: T, rowIndex: IndexAttr) => void;
  nzIndentSize?: number;

  fixed?: 'left' | 'right';
  /**
   * 是否显示展开
   */
  showExpand?: boolean | null;
  /**
   * 是否显示列
   */
  visible?: boolean | null;
  // column setting
  /**
   * 在设置中列显示的文本,如果为空 则使用thText
   */
  settingText?: string;
  /**
   *  在设置中是否显示该列
   */
  settingVisible?: boolean | null;
  /**
   * 是否禁用
   */
  settingDisabled?: boolean | null;
  /**
   * 列中按钮配置
   */
  buttons?: NzxColumnButton[];
  /**
   * 当数据为null显示的默认文本
   */
  defaultText?: string;
  [key: string]: NzSafeAny;
}

/**
 * 列中配置按钮
 */
export interface NzxColumnButton<T = NzSafeAny> {
  /**
   * 是否显示按钮, 在数据中配置 { buttons: { 'name对应的列1': { visible: true, showDivider: true, text: '数据上更新按钮文本'}}}
   */
  visible?:
    | boolean
    | undefined
    | null
    | void
    | ((row: T, rowIndex: IndexAttr, column: NzxColumn<T>) => boolean | undefined | null | void);
  /**
   * 权限标识, 需要配置NzxAntdService.hasAuth
   */
  permission?: NzSafeAny;
  /**
   * 是否显示分割线, 在数据中配置 { 行数据, buttons: {'name对应的列1': {按钮配置}, 'name对应的列3': {按钮配置}}
   */
  showDivider?: boolean;
  /**
   * 按钮文本, 在数据中配置 { 行数据, buttons: {'name对应的列1': {按钮配置}, 'name对应的列3': {按钮配置}}
   */
  text?: string;
  /**
   * 按钮图标, 在数据中配置 { 行数据, buttons: {'name对应的列1': {按钮配置}, 'name对应的列3': {按钮配置}}
   */
  icon?: string;
  /**
   * 按钮的type属性, button, submit reset, 在数据中配置 { 行数据, buttons: {'name对应的列1': {按钮配置}, 'name对应的列3': {按钮配置}}
   */
  type?: string;
  /**
   * 是否是a链接, 默认true
   */
  link?: boolean;
  /**
   * 允许数据中配置
   */
  nzBlock?: boolean;
  /**
   * 允许数据中配置
   */
  nzDanger?: boolean;
  /**
   * 允许数据中配置
   */
  nzGhost?: boolean;
  /**
   * 允许数据中配置
   */
  nzSize?: NzButtonSize;
  /**
   * 允许数据中配置
   */
  nzLoading?: boolean;
  /**
   * 允许数据中配置
   */
  nzSearch?: boolean;
  /**
   * 允许数据中配置
   */
  nzShape?: NzButtonShape;
  /**
   * 允许数据中配置
   */
  nzType?: NzButtonType;
  /**
   * 允许数据中配置
   */
  disabled?: boolean;
  click: (row: T, data: T[], evt: MouseEvent) => void;
  /**
   * 如果是a标签 则设置属性target, 允许数据中配置
   */
  target?: '_blank' | '_parent' | '_self' | '_top';
  /**
   * 如果是a标签,设置href, 允许数据中配置
   */
  href?: string | ((row: T, data: T[], index: number, col: NzxColumn<T>) => string);
}

export interface IndexAttr {
  /**
   * 当前条目的索引
   */
  readonly index: number;
  /**
   * 是否为第一条
   */
  readonly first: boolean;
  /**
   * 是否最后一条
   */
  readonly last: boolean;
  /**
   * 索引是否为偶数
   */
  readonly even: boolean;
  /**
   * 索引是否为奇数
   */
  readonly odd: boolean;
}

export type NzxStyleType = { [klass: string]: NzSafeAny } | null;
export type NzxClassType = string | string[] | Set<string> | { [klass: string]: NzSafeAny };

export interface RowEventArg<T> {
  row: T;
  event: MouseEvent;
  rowIndex: IndexAttr;
}

export interface CellEventArg<T> extends RowEventArg<T> {
  column: NzxColumn;
  colIndex: IndexAttr;
}

export interface HeaderEventArg {
  column: NzxColumn;
  event: MouseEvent;
}

/**
 * 请求配置
 */
export interface FetchSetting {
  /**
   * 请求接口当前页数
   */
  pageIndexField?: string;
  /**
   * 每页显示多少条
   */
  pageSizeField?: string;
  /**
   * 请求结果列表字段  支持 a.b.c
   */
  listField?: string;
  /**
   * 请求结果总数字段  支持 a.b.c
   */
  totalField?: string;
  /**
   * 请求方式
   */
  method?: string;
  /**
   *  相应类型
   */
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
}

/**
 * 排序
 */
export interface SorterResult {
  column?: NzxColumn;
  order: NzTableSortOrder;
  field: string;
}

/**
 * 分页信息
 */
export interface PageInfo<T> {
  total: number;
  /**
   * 列表数据
   */
  list: T[];
  /**
   * 修正后的当前页码
   */
  pageIndex?: number;
}

/**
 * 表格大小
 */
export type NzxTableSize = NzTableSize | 'mini';

/**
 * 合并单元格参数
 */
export type SpanFunc<T> = (params: CellArgType<T>) => void | RowColspan | [number, number] | null;

export type CellArgType<T> = {
  nzData: T[];
  nzPageData: T[];
  row: T;
  column: NzxColumn<T>;
  rowIndex: IndexAttr;
  colIndex: IndexAttr;
};

export interface RowColspan {
  colspan?: number | null | void;
  rowspan?: number | null | void;
}

export type TrTemplateArgs<T> = {
  $implicit: T;
  row: T;
  nzData: T[];
  nzPageData: T[];
  columns: NzxColumn<T>[];
} & IndexAttr;
