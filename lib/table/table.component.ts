import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { PaginationItemRenderContext } from 'ng-zorro-antd/pagination';
import { Any } from '@xmagic/nzx-antd';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import {
  CellEventArg,
  FetchSetting,
  HeaderEventArg,
  IndexAttr,
  NzxColumn,
  NzxTableSize,
  PageInfo,
  RowEventArg,
  SorterResult,
  SpanFunc,
  TrTemplateArgs
} from './table.type';
import { FETCH_SETTING } from './const';
import { debounceTime, fromEvent, merge, Observable, Subject, takeUntil } from 'rxjs';
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
export class NzxTableComponent<T extends Record<string, Any> = Any>
  implements OnInit, AfterContentInit, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * 当前选中的行
   */
  _selectRow?: T;
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
   * 是否显示斑马线
   */
  @Input() nzxStripe = false;
  /**
   * 请求之前处理函数
   */
  @Input() beforeFetch?: (params: Record<string, Any>) => Record<string, Any> | Promise<Any>;
  /**
   * 请求之后处理函数
   */
  @Input() afterFetch?: (
    res: Any,
    pageIndex: number,
    reset: boolean
  ) => Partial<PageInfo<T>> | Promise<Partial<PageInfo<T>>>;

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
   * 是否显示表头
   */
  @Input() nzxShowHeader?: boolean;
  /**
   * 工具栏-在工具栏之前
   */
  @Input() toolbarBefore?: string | TemplateRef<void>;
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
  @Input() nzTitle?: string | TemplateRef<Any>;
  /**
   * 表格尾部
   */
  @Input() nzFooter?: string | TemplateRef<Any>;
  /**
   * 无数据时显示内容
   */
  @Input() nzNoResult?: string | TemplateRef<Any>;
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
   * 最小滚动宽度
   */
  @Input() minScrollX?: number;
  /**
   * 最小滚动高度
   */
  @Input() minScrollY?: number;
  /**
   * 自动设置scrollX, 撑满父级容易
   */
  @Input() scrollXFillParent?: boolean;
  /**
   * 自动设置scrollY, 撑满父级容易
   */
  @Input() scrollYFillParent?: boolean;
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
  @Input() nzLoadingIndicator?: TemplateRef<Any>;
  /**
   * 是否展示外边框和列边框
   */
  @Input() nzBordered = false;
  /**
   * 表格大小, 正常或迷你类型
   */
  @Input() nzSize: NzxTableSize = 'small';
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
   * 当数据为null显示的默认文本
   */
  @Input() defaultText?: string;

  /**
   * 由外部传入模板列表
   */
  @Input() tplMap?: Map<string, TemplateRef<Any>>;
  /**
   * 虚拟滚动数据 TrackByFunction 函数
   */
  @Input() nzVirtualForTrackBy?: TrackByFunction<T>;
  /**
   * 合并单元格
   */
  @Input() nzxSpanFunc?: SpanFunc<T>;
  /**
   * 自定义tr
   */
  @Input() nzxTr?: TemplateRef<TrTemplateArgs<T>>;
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
  /**
   * 刷新按钮点击事件
   */
  @Output() readonly refreshClick = new EventEmitter<NzxTableComponent>();
  /**
   * 排序列触发
   */
  @Output() sortedColumn = new EventEmitter<CdkDragDrop<NzxColumn<T>, Any>>();

  @ContentChildren(NamedTemplate) children!: QueryList<NamedTemplate<Any>>;
  @ViewChild('basicTable') nzTable!: NzTableComponent<T>;
  private resize$ = new Subject<void>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected render: Renderer2,
    protected http: HttpClient,
    protected elementRef: ElementRef<HTMLDivElement>,
    private antdService: NzxAntdService
  ) {}

  ngOnInit(): void {
    merge(this.nzPageIndexChange, this.nzPageSizeChange)
      .pipe(debounceTime(50))
      .subscribe(() => this.fetch(false));
    this.nzPageSize = this.nzPageSize || this.antdService.table?.nzPageSize || 10;
    this.resolveColumns();
    this.fetch();
  }

  onResize({ width }: NzResizeEvent, col: NzxColumn) {
    col.nzWidth = width + 'px';
  }

  /**
   * 切换表格大小, 增加mini 类型
   * @param size 表格大小
   * @param table nz表格组件
   */
  tableSizeChange(size: NzxTableSize, table: NzTableComponent<Any>) {
    this.nzSize = size;
    // @ts-ignore
    const tableMainElement = table.elementRef.nativeElement.querySelector('.ant-table');
    if (!tableMainElement) {
      return;
    }
    if (size === 'mini') {
      this.render.addClass(tableMainElement, 'ant-table-mini');
    } else {
      this.render.removeClass(tableMainElement, 'ant-table-mini');
    }
  }

  /**
   * 点击刷新按钮
   */
  onRefreshClick() {
    if (this.refreshClick.observed) {
      this.refreshClick.emit(this);
    } else {
      this.fetch(false);
    }
  }

  /**
   * 刷新
   * @param reset
   */
  refresh(reset = true) {
    return this.fetch<T>(reset);
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
  fetch<T>(reset = true): Promise<PageInfo<T>> | null {
    if (!this.api) {
      return null;
    }

    return new Promise<PageInfo<T>>((resolve, reject) => {
      const fetchSetting = Object.assign({}, FETCH_SETTING, this.antdService.table, this.fetchSetting);
      const setResult: (res: Record<string, Any> | T) => void = res => {
        this.setFetchResult(res, fetchSetting, reset).then(v => resolve(v as unknown as PageInfo<T>), reject);
      };

      if (NzxUtils.isString(this.api)) {
        FetcherService.resolveParams(this.params)
          .pipe(
            switchMap(_params => {
              const commonParams = this.mergeParams(reset, fetchSetting);
              const data = Object.assign({}, _params, commonParams);
              const beforeFetch = this.beforeFetch || this.antdService.table?.beforeFetch;
              if (!beforeFetch) {
                return this.doFetch(this.api as string, fetchSetting.method, commonParams, data);
              }

              return FetcherService.resolveParams(beforeFetch(data)).pipe(_data =>
                this.doFetch(this.api as string, fetchSetting.method, commonParams, _data)
              );
            })
          )
          .subscribe({
            next: res =>
              this.setFetchResult(res, fetchSetting, reset).then(v => resolve(v as unknown as PageInfo<T>), reject),
            error: err => reject(err)
          });
        return;
      }

      if (NzxUtils.isObservable(this.api)) {
        (this.api as unknown as Observable<T[]>).subscribe({ next: setResult, error: err => reject(err) });
        return;
      }
      if (NzxUtils.isPromise(this.api)) {
        (this.api as unknown as Promise<T[]>).then(setResult, reject);
        return;
      }

      setResult([]);
    });
  }

  /**
   * 行点击事件
   * @param info
   */
  onRowClick(info: RowEventArg<T>) {
    this.rowClick.emit(info);
    if (this.nzxClickSelectedRow !== false) {
      this._selectRow = this._selectRow === info.row ? undefined : info.row;
    }
  }

  /**
   * 执行请求
   * @param url
   * @param method
   * @param params
   * @param data
   * @protected
   */
  protected doFetch(url: string, method?: string, params?: Any, data?: Any): Observable<PageInfo<T>> {
    const option: { params?: Any; body?: Any } = {};
    method ||= 'post';
    if (/^post|put$/i.test(method)) {
      option.params = params;
      option.body = data;
    } else {
      option.params = Object.assign({}, data, params);
    }
    return this.http.request<PageInfo<T>>(method, url, option);
  }

  /**
   * 处理请求结果
   * @param res
   * @param fetchSetting
   * @param reset
   * @private
   */
  private setFetchResult<K>(res: K, fetchSetting: FetchSetting, reset: boolean): Promise<PageInfo<T>> {
    let result: Partial<PageInfo<T>> = {};
    const afterFetch = this.afterFetch || this.antdService.table?.afterFetch;
    if (afterFetch && NzxUtils.isFunction(afterFetch)) {
      const data = afterFetch(res, this.nzPageIndex, reset);
      if (NzxUtils.isPromise(data)) {
        return data.then(v => this.setPageInfo(res, v, fetchSetting, reset));
      }
      result = data || {};
    } else {
      if (Array.isArray(res)) {
        result.list = res;
        result.total = res.length;
      }
    }

    return Promise.resolve(this.setPageInfo(res, result, fetchSetting, reset));
  }

  /**
   * 设置分页信息
   * @param res 响应对象
   * @param pageInfo 原pageInfo
   * @param fetchSetting 配置
   * @param reset 是否重置
   * @private
   */
  private setPageInfo<K>(
    res: K,
    pageInfo: Partial<PageInfo<T>>,
    fetchSetting: FetchSetting,
    reset: boolean
  ): PageInfo<T> {
    const total = pageInfo.total != null ? pageInfo.total : NzxUtils.get(res, fetchSetting.totalField!);
    const pageIndex = reset
      ? 1
      : pageInfo.pageIndex != null
      ? pageInfo.pageIndex
      : NzxUtils.get(res, fetchSetting.pageIndexField!);

    this.nzData = pageInfo.list || NzxUtils.get(res, fetchSetting.listField!);
    this.nzTotal = total || 0;

    if (pageIndex != null) {
      this.nzPageIndex = pageIndex;
    }

    this.cdr.markForCheck();
    return pageInfo as PageInfo<T>;
  }

  /**
   * 合并请求参数
   * @param reset
   * @param fetchSetting
   * @private
   */
  private mergeParams(reset = true, fetchSetting: FetchSetting) {
    const nzPageIndex = reset ? 1 : this.nzPageIndex;
    const params: Record<string, Any> = {};
    NzxUtils.set(params, fetchSetting.pageIndexField!, nzPageIndex);
    NzxUtils.set(params, fetchSetting.pageSizeField!, this.nzPageSize);

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
  protected isAsync(obj: Any): boolean {
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
    const nameTemplateMap: Record<string, TemplateRef<Any>> = {};
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
    nameTemplateMap: Record<string, TemplateRef<Any>>
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

  ngAfterViewInit(): void {
    if (this.nzSize === 'mini') {
      this.tableSizeChange(this.nzSize, this.nzTable);
    }

    if (this.scrollXFillParent || this.scrollYFillParent) {
      const element = this.elementRef.nativeElement.parentElement!;
      const fixedAutoScroll = () => {
        if (this.scrollXFillParent) {
          this.fixXFillParent(element);
        }

        if (this.scrollYFillParent) {
          this.fixYFillParent(element);
        }
      };
      fromEvent(window, 'resize')
        .pipe(takeUntil(this.resize$), debounceTime(80))
        .subscribe(() => fixedAutoScroll());
      fixedAutoScroll();
    }
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
  }

  /**
   * 拖拽排序
   * @param event
   */
  onSortedColumn(event: CdkDragDrop<NzxColumn<T>, Any>) {
    moveItemInArray(this._headerColumns[0], event.previousIndex, event.currentIndex);
    this.sortedColumn.emit(event);
  }

  ngOnDestroy(): void {
    this.resize$.next();
    this.resize$.complete();
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
      .map(() => []) as Any;

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

  /**
   * 计算x轴滚动大小
   * @param element
   * @private
   */
  private fixXFillParent(element: HTMLElement) {
    if (!element.clientWidth) {
      return;
    }
    if (this.minScrollX) {
      this.scrollX = `${element.clientWidth >= this.minScrollX ? element.clientWidth : this.minScrollX}px`;
    } else {
      this.scrollX = `${element.clientWidth}px`;
    }
  }

  /**
   * 计算y轴滚动大小
   * @param element
   * @private
   */
  private fixYFillParent(element: HTMLElement) {
    if (!element.clientHeight) {
      return;
    }
    if (this.minScrollY) {
      this.scrollY = `${element.clientHeight >= this.minScrollY ? element.clientHeight : this.minScrollY}px`;
    } else {
      this.scrollY = `${element.clientHeight}px`;
    }
  }
}
