import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  NgIterable,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef
} from '@angular/core';

/**
 * 和ngFor指令用法类似,同时支持多种数据结构,比如: Map,key/value,Iterable,
 * 使用 `*ngx-for` 和 `*ngxFor`是等效的。如果是迭代对象（数组等）上下文参数中的key和index是一样的, key是`string`类型
 * @example
 * ```ts
 * @Component({
 *   selector: 'test',
 *   template: `
 * <ul>
 *   <li *ngx-for="let value of myObject; index as index; key as key">
 *     {{ index }}. {{ key }}: {{ value }}
 *   </li>
 *
 *   <li *ngx-for="let value of myList; index as index; key as key">
 *     {{ index }}. {{ key }}: {{ value }}
 *   </li>
 *
 *   <li *ngxFor="let value of myObject; index as index; key as key">
 *     {{ index }}. {{ key }}: {{ value }}
 *   </li>
 *
 *   <li *ngxFor="let value of myList; index as index; key as key">
 *     {{ index }}. {{ key }}: {{ value }}
 *   </li>
 * </ul>
 *   `,
 * })
 * export class TestComponent {
 *   myObject = {
 *     name1: '张三',
 *     name2: '李四',
 *     name3: '王五'
 *   };
 *
 *   myList = ['张三', '李四', '王五']
 * }
 * ```
 */
@Directive({ selector: '[ngx-for][ngx-forOf],[ngxFor][ngxForOf]' })
export class NgxFor<T, U extends NgxIterable<T> = NgxIterable<T>> implements DoCheck {
  private _ngxForOf: U | undefined | null = null;
  private _ngxForDirty = true;
  private _differ: Differ<T> | null = null;
  private _trackByFn!: TrackByFunction<T>;

  static ngxTemplateContextGuard<T, U extends NgxIterable<T>>(dir: NgxFor<T, U>, ctx: any): ctx is NgxForContext<T, U> {
    return true;
  }

  get ngxForTrackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }

  @Input()
  set ngxForTrackBy(fn: TrackByFunction<T>) {
    this._trackByFn = fn;
  }

  @Input()
  set ngxForOf(ngxFor: (U & NgxIterable<T>) | undefined | null) {
    this._ngxForOf = ngxFor;
    this._ngxForDirty = true;
  }

  @Input('ngx-forOf')
  set ngxFor_2(ngxFor: (U & NgxIterable<T>) | undefined | null) {
    this._ngxForOf = ngxFor;
    this._ngxForDirty = true;
  }

  @Input('ngx-forTrackBy')
  set ngxForTrackBy_2(fn: TrackByFunction<T>) {
    this._trackByFn = fn;
  }

  constructor(
    private _viewContainer: ViewContainerRef,
    private _template: TemplateRef<NgxForContext<T, U>>,
    private _differs: IterableDiffers,
    private _kvDiffers: KeyValueDiffers
  ) {}

  @Input()
  set ngxForTemplate(value: TemplateRef<NgxForContext<T, U>>) {
    if (value) {
      this._template = value;
    }
  }
  @Input('ngx-forTemplate')
  set ngxForTemplate_2(value: TemplateRef<NgxForContext<T, U>>) {
    if (value) {
      this._template = value;
    }
  }

  ngDoCheck(): void {
    if (this._ngxForDirty) {
      this._ngxForDirty = false;
      const value = this._ngxForOf;
      if (!value) {
        this._differ = null;
      } else if (!this._differ) {
        const factory = this._differs.find([]);
        if (factory.supports(value)) {
          this._differ = new IterDiffer(factory.create(this._trackByFn), this._viewContainer, this._template);
        } else {
          const kvFactory = this._kvDiffers.find({});
          if (kvFactory.supports(value)) {
            this._differ = new KvDiffer(kvFactory.create(), this._viewContainer, this._template);
          }
        }
      }
    }

    if (this._differ) {
      const changes = this._differ.diff(this._ngxForOf);
      if (changes) {
        changes.applyChanges(this._ngxForOf);
      }
    }
  }
}

function applyViewChange<T>(view: EmbeddedViewRef<NgxForContext<T>>, value: T) {
  view.context.$implicit = value;
}

function resolveContext<T>(
  viewContainer: ViewContainerRef,
  _ngxFor: any,
  callback: (context: NgxForContext<T, NgxIterable<T>>) => void = () => 0
) {
  for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
    const viewRef = <EmbeddedViewRef<NgxForContext<T, NgxIterable<T>>>>viewContainer.get(i);
    const context = viewRef.context;
    context.index = i;
    context.count = ilen;
    context.ngxFor = _ngxFor!;
    callback(context);
  }
}

export class NgxForContext<T, U extends NgxIterable<T> = NgxIterable<T>> {
  constructor(
    public $implicit: T | null,
    public ngxFor: U,
    public index: number,
    public key: string,
    public count: number
  ) {}

  get first(): boolean {
    return this.index === 0;
  }

  get last(): boolean {
    return this.index === this.count - 1;
  }

  get even(): boolean {
    return this.index % 2 === 0;
  }

  get odd(): boolean {
    return !this.even;
  }
}

export declare type NgxIterable<T> = NgIterable<T> | NgxKv<T>;
export declare type NgxKv<T> = Record<string, T> | Map<string, T>;

interface ApplyChanges<T> {
  applyChanges(_ngxFor?: any): void;
}

interface Differ<T> {
  diff(value?: any): ApplyChanges<T> | null;
}

class IterDiffer<T> implements Differ<T> {
  constructor(
    public differ: IterableDiffer<T>,
    public _viewContainer: ViewContainerRef,
    public _template: TemplateRef<NgxForContext<T, NgxIterable<T>>>
  ) {}

  diff(value?: NgIterable<T> | null): ApplyChanges<T> | null {
    const changes = this.differ.diff(value);
    if (!changes) {
      return null;
    }
    return {
      applyChanges: _ngxFor => {
        const viewContainer = this._viewContainer;
        changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
          if (item.previousIndex == null) {
            viewContainer.createEmbeddedView(
              this._template,
              new NgxForContext(item.item, _ngxFor!, -1, '', -1),
              currentIndex === null ? undefined : currentIndex
            );
          } else if (currentIndex == null) {
            viewContainer.remove(adjustedPreviousIndex === null ? undefined : adjustedPreviousIndex);
          } else if (adjustedPreviousIndex !== null) {
            const view = viewContainer.get(adjustedPreviousIndex)!;
            viewContainer.move(view, currentIndex);
            applyViewChange(view as EmbeddedViewRef<NgxForContext<T, NgxIterable<T>>>, item.item);
          }
        });

        resolveContext(viewContainer, _ngxFor, context => (context.key = context.index + ''));

        changes.forEachIdentityChange(record => {
          const viewRef = <EmbeddedViewRef<NgxForContext<T, NgxIterable<T>>>>viewContainer.get(record.currentIndex!);
          applyViewChange(viewRef, record.item);
        });
      }
    };
  }
}

class KvDiffer<T> implements Differ<T> {
  private keyIndex: Record<string, number> = {};
  constructor(
    public differ: KeyValueDiffer<any, T>,
    public _viewContainer: ViewContainerRef,
    public _template: TemplateRef<NgxForContext<T, NgxIterable<T>>>
  ) {}

  diff(value?: Record<string, T> | Map<any, T> | null): ApplyChanges<T> | null {
    const changes = this.differ.diff(value as Record<string, T>);
    if (!changes) {
      return null;
    }
    return {
      applyChanges: _ngxFor => {
        const viewContainer = this._viewContainer;

        const removes: number[] = [];
        changes.forEachRemovedItem(item => {
          const index = this.keyIndex[item.key];
          removes.push(index);
          delete this.keyIndex[item.key];
        });

        removes.sort();
        for (let i = removes.length - 1; i >= 0; i--) {
          viewContainer.remove(removes[i]);
        }

        changes.forEachChangedItem(item => {
          const index = this.keyIndex[item.key];
          const view = viewContainer.get(index)!;
          applyViewChange(view as EmbeddedViewRef<NgxForContext<T, NgxKv<T>>>, item.currentValue);
        });

        const keys = value instanceof Map ? Array.from(value.keys()) : Object.keys(value as {});
        changes.forEachAddedItem(item => {
          viewContainer.createEmbeddedView(
            this._template,
            new NgxForContext(item.currentValue, _ngxFor!, -1, item.key, -1),
            keys.indexOf(item.key)
          );
        });

        resolveContext(viewContainer, _ngxFor, context => (this.keyIndex[context.key] = context.index));
      }
    };
  }
}
