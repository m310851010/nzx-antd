import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxUploadComponent } from './upload.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';

const COMPONENT = [NzxUploadComponent];

@NgModule({
  declarations: [COMPONENT],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzMessageModule,
    NzButtonModule,
    NzIconModule,
    NzOutletModule
  ],
  exports: [COMPONENT]
})
export class NzxUploadModule {}
