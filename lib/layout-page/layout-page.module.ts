import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzxContentComponent } from './content.component';
import { NzxPageComponent } from './page.component';
import { NzxHeaderComponent } from './header.component';
import { ObserversModule } from '@angular/cdk/observers';

const COMPONENTS = [NzxContentComponent, NzxPageComponent, NzxHeaderComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, ObserversModule],
  exports: [COMPONENTS]
})
export class NzxLayoutPageModule {}
