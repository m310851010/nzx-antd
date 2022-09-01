import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  NzTableComponent,
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableQueryParams,
  NzTableSize,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { PaginationItemRenderContext } from 'ng-zorro-antd/pagination';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import {
  CellEventArg,
  FetchSetting,
  HeaderEventArg,
  IndexAttr,
  NzxColumn,
  PageInfo,
  RowEventArg,
  SorterResult
} from './table.type';
import { FETCH_SETTING } from './const';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NzxAntdService } from '@xmagic/nzx-antd';
import { FetcherService, FetchParams } from '@xmagic/nzx-antd/service';
import { NamedTemplate } from '@xmagic/nzx-antd/directive';

/**
 * 基于nz-table二次封装的表格组件
 * ## 特性
 * - 配置加载数据: `api: string | Promise<T[]> | Observable<T[]>`
 * - 支持列的配置: `nzxColumns: NzxColumn<T>[]`
 * - 列支持排序配置
 * - 默认支持显示拖动列, 调整列顺序
 * - 支持配置显示序号、复选框
 * - 自定义渲染内容， template使用名称即可引用成功
 * - 支持请求/响应信息配置, `fetchSetting?: FetchSetting`
 * - 支持异步格式化列数据
 */
@Component({
  selector: 'nzx-table',
  templateUrl: './table.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.nzx-table]': 'true' }
})
export class NzxTableComponent<T extends Record<string, NzSafeAny> = NzSafeAny>
  implements OnInit, AfterContentInit, OnChanges
{
  /**
   * 当前选中的行
   */
  _selectRow?: NzxColumn<T>;
  /**
   * 当前页数据
   */
  _currentPageData: readonly T[] = [];
  _headerColumns: NzxColumn<T>[][] = [];
  _bodyColumns: NzxColumn<T>[] = [];
  _allColumns: NzxColumn<T>[] = [];

  sortInfo?: SorterResult;
  defaultPageSizeOptions = [10, 15, 20, 30, 40, 50, 100];

  /**
   * 请求处理
   */
  @Input() api!: string | Promise<T[]> | Observable<T[]>;

  /**
   * 请求参数
   */
  @Input() params?: FetchParams;
  /**
   * 是否显示刷新按钮
   */
  @Input() nzxRefreshVisible = true;
  /**
   * 是否显示调整表格大小按钮
   */
  @Input() nzxResizeVisible = true;
  /**
   * 显示配置列, 只在非合并表头时可用
   */
  @Input() nzxSettingVisible = true;
  /**
   * 请求之前处理函数
   */
  @Input() beforeFetch?: (params: Record<string, NzSafeAny>) => Record<string, NzSafeAny> | Promise<NzSafeAny>;
  /**
   * 请求之后处理函数
   */
  @Input() afterFetch?: (res: NzSafeAny, pageIndex: number) => PageInfo<T> | Promise<PageInfo<T>>;

  /**
   * 请求配置
   */
  @Input() fetchSetting?: FetchSetting;
  /**
   * 排序函数
   */
  @Input() sortFn!: (data: SorterResult) => SorterResult;

  /**
   * 配置列
   */
  @Input() nzxColumns: NzxColumn<T>[] = [];

  /**
   * 默认渲染表头
   */
  @Input() nzxDefaultRenderHeader = true;
  /**
   * 标题
   */
  @Input() title?: string | TemplateRef<void>;
  /**
   * 工具栏
   */
  @Input() toolbar?: string | TemplateRef<void>;
  /**
   * 是否能调整列大小
   */
  @Input() nzxResizable = true;
  /**
   * 表格布局
   */
  @Input() nzTableLayout: NzTableLayout = 'auto';
  /**
   * 用于显示数据总量和当前数据范围，用法参照 Pagination 组件
   */
  @Input() nzShowTotal?: TemplateRef<{ $implicit: number; range: [number, number] }>;
  /**
   * 用于自定义页码的结构，用法参照 Pagination 组件
   */
  @Input() nzItemRender?: TemplateRef<PaginationItemRenderContext>;
  /**
   * 表格标题
   */
  @Input() nzTitle?: string | TemplateRef<NzSafeAny>;
  /**
   * 表格尾部
   */
  @Input() nzFooter?: string | TemplateRef<NzSafeAny>;
  /**
   * 无数据时显示内容
   */
  @Input() nzNoResult?: string | TemplateRef<NzSafeAny>;
  /**
   * 	页数选择器可选值
   */
  @Input() nzPageSizeOptions?: number[];
  /**
   * 虚拟滚动时每一列的高度，与 cdk itemSize 相同
   */
  @Input() nzVirtualItemSize = 0;
  /**
   * 	缓冲区最大像素高度，与 cdk maxBufferPx 相同
   */
  @Input() nzVirtualMaxBufferPx = 200;
  /**
   * 缓冲区最小像素高度，低于该值时将加载新结构，与 cdk minBufferPx 相同
   */
  @Input() nzVirtualMinBufferPx = 100;
  /**
   * 延迟显示加载效果的时间（防止闪烁）
   */
  @Input() nzLoadingDelay = 0;
  /**
   * 	当前页码，可双向绑定
   */
  @Input() nzPageIndex = 1;
  /**
   * 每页展示多少数据，可双向绑定
   */
  @Input() nzPageSize?: number;
  /**
   * 当前总数据，在服务器渲染时需要传入
   */
  @Input() nzTotal = 0;
  /**
   * 表头分组时指定每列宽度，与 th 的 [nzWidth] 不可混用
   */
  @Input() nzWidthConfig: ReadonlyArray<string | null> = [];
  /**
   * 表格数据
   */
  @Input() nzData: readonly T[] = [];
  /**
   * 指定分页显示的位置
   */
  @Input() nzPaginationPosition: NzTablePaginationPosition = 'bottom';
  /**
   * 横向支持滚动
   */
  @Input() scrollX?: string;
  /**
   * 纵向支持滚动
   */
  @Input() scrollY?: string;
  /**
   * 指定分页显示的尺寸
   */
  @Input() nzPaginationType: NzTablePaginationType = 'default';
  /**
   * 是否在前端对数据进行分页，如果在服务器分页数据或者需要在前端显示全部数据时传入 false
   */
  @Input() nzFrontPagination = false;
  /**
   * 模板模式，无需将数据传递给 nzData
   */
  @Input() nzTemplateMode = false;
  /**
   * 	是否显示分页器
   */
  @Input() nzShowPagination = true;
  /**
   * 页面是否加载中
   */
  @Input() nzLoading = false;
  /**
   * 是否显示外边框
   */
  @Input() nzOuterBordered = false;
  /**
   * 加载指示符
   */
  @Input() nzLoadingIndicator?: TemplateRef<NzSafeAny>;
  /**
   * 是否展示外边框和列边框
   */
  @Input() nzBordered = false;
  /**
   * 表格大小, 正常或迷你类型
   */
  @Input() nzSize: NzTableSize = 'middle';
  /**
   * 是否可以改变 nzPageSize
   */
  @Input() nzShowSizeChanger = true;
  /**
   * 只有一页时是否隐藏分页器
   */
  @Input() nzHideOnSinglePage = false;
  /**
   * 是否可以快速跳转至某页
   */
  @Input() nzShowQuickJumper = true;
  /**
   * 当添加该属性时，显示为简单分页
   */
  @Input() nzSimple = false;

  /**
   * 是否显示操作按钮小图标
   */
  @Input() actionVisible?: boolean;
  /**
   * 是否显示顶部标题
   */
  @Input() toolbarVisible?: boolean;
  /**
   * 点击行是否选中
   */
  @Input() nzxClickSelectedRow?: boolean;

  /**
   * 由外部传入模板列表
   */
  @Input() tplMap?: Map<string, TemplateRef<NzSafeAny>>;
  /**
   * 虚拟滚动数据 TrackByFunction 函数
   */
  @Input() nzVirtualForTrackBy?: TrackByFunction<T>;
  /**
   * 页数改变时的回调函数
   */
  @Output() readonly nzPageSizeChange = new EventEmitter<number>();
  /**
   * 当前页码改变时的回调函数
   */
  @Output() readonly nzPageIndexChange = new EventEmitter<number>();
  /**
   * 	当服务端分页、筛选、排序时，用于获得参数
   */
  @Output() readonly nzQueryParams = new EventEmitter<NzTableQueryParams>();
  /**
   * 当前页面展示数据改变的回调函数
   */
  @Output() readonly nzCurrentPageDataChange = new EventEmitter<readonly T[]>();

  /**
   * 数据行点击事件
   */
  @Output() readonly rowClick = new EventEmitter<RowEventArg<T>>();
  /**
   * 数据行双击事件
   */
  @Output() readonly rowDblclick = new EventEmitter<RowEventArg<T>>();
  /**
   * 数据行右键菜单事件
   */
  @Output() readonly rowContextmenu = new EventEmitter<RowEventArg<T>>();

  /**
   * 单元格点击事件
   */
  @Output() readonly cellClick = new EventEmitter<CellEventArg<T>>();
  /**
   * 单元格双击事件
   */
  @Output() readonly cellDblclick = new EventEmitter<CellEventArg<T>>();
  /**
   * 单元格右键菜单事件
   */
  @Output() readonly cellContextmenu = new EventEmitter<CellEventArg<T>>();

  /**
   * 表头单元格事件
   */
  @Output() readonly headerClick = new EventEmitter<HeaderEventArg>();
  /**
   * 表头单元格双击事件
   */
  @Output() readonly headerDblclick = new EventEmitter<HeaderEventArg>();
  /**
   * 表头单元格右键菜单事件
   */
  @Output() readonly headerContextmenu = new EventEmitter<HeaderEventArg>();

  @ContentChildren(NamedTemplate) children!: QueryList<NamedTemplate<NzSafeAny>>;
  @ViewChild('basicTable') nzTable!: NzTableComponent<T>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected render: Renderer2,
    protected http: HttpClient,
    private antdService: NzxAntdService
  ) {}

  ngOnInit(): void {
    this.nzPageSize = this.nzPageSize || this.antdService.table?.nzPageSize || 10;
    this.resolveColumns();
    this.fetch();
  }

  /**
   * 获取链接地址
   * @param btn btn配置
   * @param row 当前行
   * @param data 上下文信息
   */
  getLinkHref(btn: { href: string | ((row: T, data: T[]) => string) }, row: T, data: T[]): string | undefined {
    if (!btn.href) {
      return undefined;
    }
    if (typeof btn.href === 'string') {
      return btn.href;
    }

    return btn.href(row, data);
  }

  onResize({ width }: NzResizeEvent, col: NzxColumn) {
    col.nzWidth = width + 'px';
  }

  /**
   * 点击刷新按钮
   */
  onRefreshClick() {
    this.fetch(false);
  }

  /**
   * 刷新
   * @param reset
   */
  refresh(reset = true) {
    this.fetch(reset);
  }

  /**
   * 固定列
   * @param column
   */
  fixedClick(column: NzxColumn<T>) {
    const hasFixed = this._allColumns.filter(value => value.fixed).length;
    this.scrollX = hasFixed ? '100vw' : undefined;
  }

  /**
   * 排序
   * @param value
   * @param col
   */
  sortOrderChange(value: NzTableSortOrder, col: NzxColumn) {
    if (col.nzSortOrderChange) {
      col.nzSortOrderChange(value, col);
    }

    const key = col.nzColumnKey! || col.name!;
    this.sortInfo = {
      column: col,
      order: value,
      field: key
    };
    this.fetch(false);
  }

  /**
   * 发起请求
   * @param reset 是否重置
   */
  fetch<T>(reset = true): void {
    if (!this.api) {
      return;
    }

    const fetchSetting = Object.assign({}, FETCH_SETTING, this.antdService.table, this.fetchSetting);
    const setResult: (value: Record<string, NzSafeAny> | T[]) => void = res =>
      this.setFetchResult(res, fetchSetting, reset);
    if (NzxUtils.isString(this.api)) {
      FetcherService.resolveParams(this.params)
        .pipe(
          switchMap(_params => {
            const commonParams = this.mergeParams(reset, fetchSetting);
            const data = Object.assign({}, _params, commonParams);
            if (!this.beforeFetch) {
              return this.doFetch(this.api as string, fetchSetting.method, commonParams, data);
            }

            return FetcherService.resolveParams(this.beforeFetch(data)).pipe(_data =>
              this.doFetch(this.api as string, fetchSetting.method, commonParams, _data)
            );
          })
        )
        .subscribe(setResult);
      return;
    }

    if (NzxUtils.isObservable(this.api)) {
      (this.api as Observable<T[]>).subscribe(setResult);
      return;
    }
    if (NzxUtils.isPromise(this.api)) {
      (this.api as Promise<T[]>).then(setResult);
      return;
    }

    setResult([]);
    return;
  }

  onClickOnce(info: RowEventArg<T>) {
    this.rowDblclick.emit(info);
    if (this.nzxClickSelectedRow !== false) {
      this._selectRow = info.row;
    }
  }

  protected doFetch(url: string, method?: string, params?: NzSafeAny, data?: NzSafeAny): Observable<PageInfo<T>> {
    const option: { params?: NzSafeAny; body?: NzSafeAny } = {};
    method ||= 'post';
    if (/^post|put$/i.test(method)) {
      option.params = params;
      option.body = data;
    } else {
      option.params = Object.assign({}, data, params);
    }
    return this.http.request<PageInfo<T>>(method, url, option);
  }

  private setFetchResult(res: Record<string, NzSafeAny> | T[], fetchSetting: FetchSetting, reset: boolean): void {
    let result: PageInfo<T> = { total: 0, list: [] };
    if (this.afterFetch && NzxUtils.isFunction(this.afterFetch)) {
      const data = this.afterFetch(res, this.nzPageIndex);
      if (NzxUtils.isPromise(data)) {
        data.then(v => this.setPageInfo(v));
        return;
      }
      result = data as PageInfo<T>;
    } else {
      if (Array.isArray(res)) {
        result.list = res;
        result.total = res.length;
      } else {
        result.list = NzxUtils.get(res, fetchSetting.listField);
        result.total = NzxUtils.get(res, fetchSetting.totalField);
        result.pageIndex = reset ? 1 : NzxUtils.get(res, fetchSetting.pageIndexField);
      }
    }

    this.formatColumnData(result.list);
    this.setPageInfo(result);
  }

  private setPageInfo(pageInfo: PageInfo<T>): void {
    this.nzData = pageInfo.list || ([] as T[]);
    this.nzTotal = pageInfo.total || 0;
    if (pageInfo.pageIndex != null) {
      this.nzPageIndex = pageInfo.pageIndex;
    }
    this.cdr.markForCheck();
  }

  /**
   * 格式化数据
   * @param list
   * @private
   */
  private formatColumnData(list: T[]) {
    if (!list) {
      return;
    }

    const formatMap = this.nzxColumns.reduce((prev, curr) => {
      if (curr.name && curr.format) {
        prev[curr.name] = curr.format;
      }
      return prev;
    }, {});

    list.forEach((value, index) => {
      if (value) {
        Object.keys(value).forEach(key => {
          if (formatMap[key]) {
            const formatValue = formatMap[key](value[key], value, index);
            if (this.isAsync(formatValue)) {
              // 异步数据
              // @ts-ignore
              value['$async-' + key] = formatValue;
            } else {
              // @ts-ignore
              value[key] = formatValue;
            }
          }
        });
      }
    });
  }

  private mergeParams(reset = true, fetchSetting: FetchSetting) {
    const params: Record<string, NzSafeAny> = {
      [fetchSetting.pageIndexField!]: reset ? 1 : this.nzPageIndex,
      [fetchSetting.pageSizeField!]: this.nzPageSize
    };

    if (this.sortInfo) {
      const sortInfo = NzxUtils.isFunction(this.sortFn) ? this.sortFn(this.sortInfo) : this.sortInfo;
      delete sortInfo.column;
      Object.assign(params, sortInfo);
    }
    return params;
  }

  /**
   * 是否是异步数据
   * @param obj
   * @protected
   */
  protected isAsync(obj: NzSafeAny): boolean {
    return NzxUtils.isObservable(obj) || NzxUtils.isPromise(obj);
  }

  /**
   * 处理表头合并单元格和 body的列
   * @protected
   */
  protected resolveColumns() {
    const { headerRows, bodyRows, allColumns } = this.getRowColumns(this.nzxColumns);
    this._headerColumns = headerRows;
    this._allColumns = allColumns;
    // 没有合并表头, 使用同一对象
    this._bodyColumns = headerRows.length ? bodyRows : headerRows[0];
  }

  /**
   * 处理参数为模板的参数, 从字符串中找到真正的模板对象
   * @protected
   */
  protected resolveTemplateColumn() {
    const nameTemplateMap: Record<string, TemplateRef<NzSafeAny>> = {};
    for (const tpl of this.children) {
      nameTemplateMap[tpl.named] = tpl.template;
    }

    if (this.tplMap) {
      this.tplMap.forEach((value, key) => (nameTemplateMap[key] = value));
    }

    this._allColumns.forEach(col =>
      Object.keys(col)
        .filter(v => /Template$/.test(v))
        .forEach(tplName => this.stringToTemplate(col, tplName, nameTemplateMap))
    );
    setTimeout(() => this.cdr.markForCheck());
  }

  /**
   * 字符串查找对应的模版
   * @param col
   * @param key
   * @param nameTemplateMap
   * @protected
   */
  protected stringToTemplate(
    col: NzxColumn<T>,
    key: keyof NzxColumn,
    nameTemplateMap: Record<string, TemplateRef<NzSafeAny>>
  ) {
    const newKey = '_' + key;
    if (typeof col[key] === 'string') {
      const tpl = nameTemplateMap[col[key]];
      if (tpl) {
        col[newKey] = tpl;
      }
    } else if (col[key] instanceof TemplateRef) {
      col[newKey] = col[key];
    }
  }

  /**
   * 表头触发CheckBox change
   * @param evt
   * @param col
   */
  thCheckedChange(evt: boolean, col: NzxColumn<T>): void {
    if (col.enableCheckAll !== false) {
      col.checked = evt;
      col.nzIndeterminate = false;
      // @ts-ignore
      this._currentPageData.forEach(v => !v.disabled && (v.checked = evt));
    }
    if (col.thCheckedChange) {
      col.thCheckedChange(evt, col);
    }
    this.cdr.markForCheck();
  }

  /**
   * td触发CheckBox change
   * @param evt
   * @param col
   * @param row
   * @param rowIndex
   */
  tdCheckedChange(evt: boolean, col: NzxColumn<T>, row: T, rowIndex: IndexAttr) {
    if (col.enableCheckAll !== false) {
      this.refreshCheckedStatus(col);
    }
    if (col.tdCheckedChange) {
      col.tdCheckedChange(evt, col, row, rowIndex);
    }
    this.cdr.markForCheck();
  }

  onCurrentPageDataChange(list: readonly T[]): void {
    this._currentPageData = list;
    const col = this._bodyColumns.filter(v => v.nzShowCheckbox)[0];
    if (col) {
      this.refreshCheckedStatus(col);
    }

    this.nzCurrentPageDataChange.emit(list);
    this.cdr.markForCheck();
  }

  refreshCheckedStatus(col: NzxColumn<T>): void {
    const list = this._currentPageData.filter(v => !v.disabled);
    if (list.length) {
      col.checked = list.every(v => v.checked);
      col.nzIndeterminate = !col.checked && list.some(v => v.checked);
    } else {
      col.checked = false;
      col.nzIndeterminate = false;
    }
  }

  ngAfterContentInit(): void {
    this.children.changes.subscribe(() => this.resolveTemplateColumn());
    this.resolveTemplateColumn();
  }

  ngOnChanges(changes: { [P in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (
      (changes.nzxColumns && !changes.nzxColumns.isFirstChange()) ||
      (changes.tplMap && !changes.tplMap.isFirstChange())
    ) {
      this.resolveColumns();
      this.resolveTemplateColumn();
    }

    if (changes.api && !changes.api.isFirstChange()) {
      this.fetch(true);
    }

    if (
      (changes.nzPageIndex && !changes.nzPageIndex.isFirstChange()) ||
      (changes.nzPageSize && !changes.nzPageSize.isFirstChange())
    ) {
      this.fetch();
    }
  }

  sortedColumn(event: CdkDragDrop<NzxColumn<T>, NzSafeAny>) {
    moveItemInArray(this._headerColumns[0], event.previousIndex, event.currentIndex);
  }

  /**
   * 获取合并表头
   * @param originColumns 原始列配置
   * @protected
   */
  protected getRowColumns(originColumns: NzxColumn<T>[]): {
    headerRows: NzxColumn<T>[][];
    bodyRows: NzxColumn<T>[];
    allColumns: NzxColumn<T>[];
  } {
    let maxLevel = 0;
    const allColumns: NzxColumn<T>[] = [];
    NzxUtils.forEachTree(originColumns, (node, parent, level) => {
      this.normalProps(node);

      allColumns.push(node);
      node.colspan = node.children && node.children.length ? 0 : 1;
      node.level = level;

      if (level > maxLevel) {
        maxLevel = level;
      }

      node.parent = parent;
      if (parent && !node.children) {
        let p = parent;
        while (p) {
          p.colspan++;
          p = p.parent;
        }
      }
    });

    const headerRows: NzxColumn<T>[][] = Array.from({ length: maxLevel + 1 })
      .fill(0)
      .map(() => []) as NzSafeAny;

    const bodyRows: NzxColumn<T>[] = [];
    allColumns.forEach(col => {
      if (!col.children) {
        col.rowspan = maxLevel - col.level + 1;
        bodyRows.push(col);
      } else {
        col.rowspan = 1;
      }
      headerRows[col.level].push(col);
    });

    return { headerRows, bodyRows, allColumns };
  }

  /**
   * 规范化属性
   * @param col 列
   * @protected
   */
  protected normalProps(col: NzxColumn<T>) {
    if (col.visible == null) {
      col.visible = true;
    }
    if (col.thText == null && col.isIndex) {
      col.thText = '序号';
    }
  }
}
