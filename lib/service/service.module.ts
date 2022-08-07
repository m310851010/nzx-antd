import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetcherService } from './fetcher.service';
import { HttpClientModule } from '@angular/common/http';
import { DownloadService } from './download.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FetcherService, DownloadService]
})
export class NzxServiceModule {}
