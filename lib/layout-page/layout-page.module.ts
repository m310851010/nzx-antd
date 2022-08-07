import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import { PageComponent } from './page.component';
import { HeaderComponent } from './header.component';
import { ObserversModule } from '@angular/cdk/observers';

const COMPONENTS = [ContentComponent, PageComponent, HeaderComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, ObserversModule],
  exports: [COMPONENTS]
})
export class LayoutPageModule {}
