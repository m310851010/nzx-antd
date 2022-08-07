import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathPipe } from './math.pipe';
import { DefaultifyPipe } from './defaultify.pipe';
import { TrustHtmlPipe, TrustScriptPipe, TrustStylePipe, TrustUrlPipe } from './trust-resource.pipe';
import { TimeUnitPipe } from './time-unit.pipe';
import { ToAsyncPipe } from './to-async.pipe';
import { FilterPipe } from './filter.pipe';

const PIPE = [
  MathPipe,
  DefaultifyPipe,
  TrustUrlPipe,
  TrustHtmlPipe,
  TrustScriptPipe,
  TrustStylePipe,
  TimeUnitPipe,
  ToAsyncPipe,
  FilterPipe
];
@NgModule({
  declarations: [PIPE],
  imports: [CommonModule],
  exports: [PIPE]
})
export class NzxPipeModule {}
