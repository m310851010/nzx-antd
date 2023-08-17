import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {
  NzIconRenderTemplate,
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadListType,
  NzUploadTransformFileType,
  NzUploadType,
  NzUploadXHRArgs,
  UploadFilter,
  NzShowUploadList
} from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '@xmagic/nzx-antd/util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzBytesPipe } from 'ng-zorro-antd/pipes';
import { Any } from '@xmagic/nzx-antd';

export enum ErrorType {
  /**
   * 单文件大小限制,单位KB
   */
  FILE_SIZE = 'FILE_SIZE',
  /**
   * 总文件大小限制
   */
  FILE_TOTAL_SIZE = 'FILE_TOTAL_SIZE',
  FILE_TYPE = 'FILE_TYPE',
  FILE_LIMIT = 'FILE_LIMIT',
  FILE_NAME_LENGTH = 'FILE_NAME_LENGTH',
  FILE_NAME_DUPLICATE = 'FILE_NAME_DUPLICATE'
}

@Component({
  selector: 'nzx-upload',
  templateUrl: './upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzxUploadComponent),
      multi: true
    },
    NzBytesPipe
  ]
})
export class NzxUploadComponent extends BaseControl<NzUploadFile[]> implements ControlValueAccessor, OnInit, OnChanges {
  @Input() nzFileList: NzUploadFile[] = [];
  /**
   * 自定义按钮或显示内容
   */
  @Input() nzxUploadButton?: string | TemplateRef<Any>;
  /**
   * 上传的提示信息
   */
  @Input() nzxHint?: string;
  /**
   * 拖拽上传文件显示文本
   */
  @Input() nzxUploadText = '点击或拖拽上传文件';
  /**
   * 是否显示上传按钮
   */
  @Input() nzxShowUploadButtonIcon?: boolean;
  /**
   * 上传按钮的图标
   */
  @Input() nzxUploadButtonIcon = 'cloud-upload';
  /**
   * 错误信息映射
   */
  @Input() nzxValidateMessage?: { [validateKey: string]: string };
  @Input() nzType: NzUploadType = 'select';
  /**
   * 上传的文件个数限制
   */
  @Input() nzLimit = 0;
  /**
   * 文件名重复验证
   */
  @Input() nzxFileNameDuplicate?: boolean;
  /**
   * 文件名长度
   */
  @Input() nzxFileNameLength?: number;
  /**
   * 文件大小,单位kb
   */
  @Input() nzSize = 0;
  /**
   * 总文件大小,单位kb
   */
  @Input() nzTotalSize?: number;
  @Input() nzFileType?: string | string[];
  @Input() nzAccept?: string | string[];
  @Input() nzAction?: string | ((file: NzUploadFile) => string | Observable<string>);
  @Input() nzDirectory = false;
  @Input() nzOpenFileDialogOnClick = true;
  /**
   * 是否显示验证错误提示信息
   */
  @Input() nzxShowValidateMessage?: boolean;
  @Input() nzBeforeUpload?: (
    file: NzUploadFile,
    fileList: NzUploadFile[],
    error: FileValidateError | null
  ) => boolean | Observable<boolean>;
  _nzBeforeUpload?: (file: NzUploadFile, fileList: NzUploadFile[]) => boolean | Observable<boolean>;
  @Input() nzCustomRequest?: (item: NzUploadXHRArgs) => Subscription;
  @Input() nzData?: {} | ((file: NzUploadFile) => {} | Observable<{}>);
  @Input() nzFilter: UploadFilter[] = [];
  @Input() nzDisabled?: boolean;
  @Input() nzHeaders?: {} | ((file: NzUploadFile) => {} | Observable<{}>);
  @Input() nzListType: NzUploadListType = 'text';
  @Input() nzMultiple?: boolean;
  @Input() nzName = 'file';
  @Input() nzShowUploadList: boolean | NzShowUploadList = true;
  @Input() nzShowButton = true;
  @Input() nzWithCredentials?: boolean;
  @Input() nzRemove?: (file: NzUploadFile) => boolean | Observable<boolean>;
  @Input() nzPreview?: (file: NzUploadFile) => void;
  @Input() nzPreviewFile?: (file: NzUploadFile) => Observable<string>;
  @Input() nzPreviewIsImage?: (file: NzUploadFile) => boolean;
  @Input() nzTransformFile?: (file: NzUploadFile) => NzUploadTransformFileType;
  @Input() nzDownload?: (file: NzUploadFile) => void;
  @Input() nzIconRender!: NzIconRenderTemplate | null;
  @Input() nzFileListRender?: TemplateRef<void>;

  @Output() readonly nzChange = new EventEmitter<NzUploadChangeParam>();
  @Output() readonly nzFileListChange = new EventEmitter<NzUploadFile[]>();

  readonly defaultValidateMessage: { [K: string]: string } = {
    FILE_SIZE: '文件 "{fileName}" 大小不能超过{fileSize}',
    FILE_TOTAL_SIZE: '总上传文件大小不能超过{totalSize}',
    FILE_TYPE: '上传的文件格式只能是 "{fileType}"',
    FILE_LIMIT: '最多允许上传{fileLimit}个文件',
    FILE_NAME_LENGTH: '文件 "{fileName}" 名称长度不能大于{fileNameLength}个字符',
    FILE_NAME_DUPLICATE: '已上传名称 "{fileName}" 相同的文件，不能重复上传'
  };

  get isTemplateUploadButton() {
    return this.nzxUploadButton instanceof TemplateRef;
  }

  constructor(protected messageService: NzMessageService, protected bytesPipe: NzBytesPipe) {
    super();
  }

  ngOnInit() {
    this.setDefaultFileFilter();
    this.setNzBeforeUpload();
  }

  protected setDefaultFileFilter() {
    const defaultFilter: UploadFilter = {
      name: 'defaultFilter',
      fn: (fileList: NzUploadFile[]) => {
        let error: FileValidateError | null = null;
        const allFiles = (this.nzFileList || []).concat(fileList);
        const list = [];

        for (const file of fileList) {
          const err = this.beforeUploadValidator(file, allFiles);
          if (!err) {
            list.push(file);
          } else if (!error || err.errorType === ErrorType.FILE_TOTAL_SIZE) {
            error = err;
          }
        }

        if (error && this.nzxShowValidateMessage !== false) {
          this.messageService.error(error.message || '文件不合法，请重新选择');
        }
        return list;
      }
    };

    if (!this.nzFilter) {
      this.nzFilter = [defaultFilter];
    }

    if (!this.nzFilter.find(f => f.name === 'defaultFilter')) {
      this.nzFilter.push(defaultFilter);
    }
  }

  setNzBeforeUpload() {
    this._nzBeforeUpload = this.getNzBeforeUpload();
  }

  onNzChange(evt: NzUploadChangeParam) {
    this.onTouched();

    if (evt.type === 'success' || evt.type === 'removed') {
      this.onChange(evt.fileList);
    }
    this.nzChange.emit(evt);
  }

  writeValue(value: NzUploadFile[]): void {
    this.nzFileList = value || [];
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.nzFilter && !changes.nzFilter.isFirstChange()) {
      this.setDefaultFileFilter();
    }

    if (changes.nzBeforeUpload && !changes.nzBeforeUpload.isFirstChange()) {
      this.setNzBeforeUpload();
    }
  }

  override setDisabledState(isDisabled: boolean) {
    this.nzDisabled = isDisabled;
  }

  /**
   * 重新包装zBeforeUpload
   */
  protected getNzBeforeUpload():
    | ((file: NzUploadFile, fileList: NzUploadFile[]) => boolean | Observable<boolean>)
    | undefined {
    if (this.nzBeforeUpload) {
      return (file, fileList) => this.nzBeforeUpload!(file, fileList, this.beforeUploadValidator(file, fileList));
    }

    return undefined;
  }

  /**
   * 文件验证
   * @param file 当前文件
   * @param fileList 文件列表
   * @protected
   */
  protected beforeUploadValidator(file: NzUploadFile, fileList: NzUploadFile[]): FileValidateError | null {
    const messages = Object.assign({}, this.defaultValidateMessage, this.nzxValidateMessage);

    // 文件类型
    if (this.nzFileType != null) {
      const nzFileTypes = typeof this.nzFileType === 'string' ? [this.nzFileType] : this.nzFileType;

      if (nzFileTypes.length > 0) {
        const index = file.name.lastIndexOf('.');
        const ext = index > 0 ? file.name.substring(index + 1).toLowerCase() : null;

        if (!ext || (!nzFileTypes.includes(file.type!) && !nzFileTypes.includes(ext))) {
          return this.getError(ErrorType.FILE_TYPE, file, messages, { fileType: this.nzFileType });
        }
      }
    }

    // 单个文件大小
    if (this.nzSize != null && this.nzSize > 0 && (file.size || 0) / 1024 > this.nzSize) {
      return this.getError(ErrorType.FILE_SIZE, file, messages, {
        fileSize: this.bytesPipe.transform(this.nzSize, 2, 'kB'),
        fileName: file.name
      });
    }

    // 文件名长度
    if (this.nzxFileNameLength && file.name.length > this.nzxFileNameLength) {
      return this.getError(ErrorType.FILE_NAME_LENGTH, file, messages, {
        fileNameLength: this.nzxFileNameLength,
        fileName: file.name
      });
    }

    // 文件名重复
    if (this.nzxFileNameDuplicate === false && fileList.filter(f => f !== file).find(it => it.name === file.name)) {
      return this.getError(ErrorType.FILE_NAME_DUPLICATE, file, messages, { fileName: file.name });
    }

    // 最大上传个数
    if (this.nzLimit && fileList.length > this.nzLimit) {
      return this.getError(ErrorType.FILE_LIMIT, file, messages, { fileLimit: this.nzLimit });
    }

    // 总文件大小
    if (this.nzTotalSize && fileList.reduce((prev, curr) => (prev += curr.size || 0), 0) / 1024 > this.nzTotalSize) {
      return this.getError(ErrorType.FILE_TOTAL_SIZE, file, messages, {
        totalSize: this.bytesPipe.transform(this.nzTotalSize, 2, 'kB')
      });
    }
    return null;
  }

  /**
   * 显示文件验证错误
   * @param file 当前文件
   * @param fileList 文件列表
   * @param showValidateMessage 是否显示
   * @private
   */
  private showFileErrorMessage(
    file: NzUploadFile,
    fileList: NzUploadFile[],
    showValidateMessage?: boolean
  ): FileValidateError | null {
    const error = this.beforeUploadValidator(file, fileList);
    if (error && showValidateMessage !== false) {
      this.messageService.error(error.message || '文件不合法');
    }
    return error;
  }

  private getError(
    errorType: ErrorType,
    file: NzUploadFile,
    messages: { [K: string]: string },
    fmtData?: Record<string, Any>
  ): FileValidateError {
    return {
      errorType,
      file,
      message: NzxUtils.format(messages[errorType], fmtData)
    };
  }
}

export interface FileValidateError {
  /**
   * 验证错误类型
   */
  errorType: ErrorType;
  /**
   * 错误信息
   */
  message: string;
  /**
   * 错误的文件
   */
  file: NzUploadFile;
}
