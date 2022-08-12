import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetcherService } from './fetcher.service';
import { HttpClientModule } from '@angular/common/http';
import { NzxDownloadService } from './download.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FetcherService, NzxDownloadService]
})
export class NzxServiceModule {}
