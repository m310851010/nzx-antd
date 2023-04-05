import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamedTemplate } from './named-template';
import { ClickOnceDirective } from './click.once.directive';
import { FaIconDirective } from './fa-icon.directive';
import { ClickOutsideDirective } from './click-outside.directive';
import { LetDirective } from './let.directive';
import { DownFileDirective } from './down-file.directive';
import { AuthDirective } from './auth.directive';
import { AuthNotDirective } from './auth.not.directive';
import { NzxServiceModule } from '@xmagic/nzx-antd/service';
import { NgxFor } from './ngx-for.directive';

const DIRECTIVE = [
  NamedTemplate,
  ClickOnceDirective,
  FaIconDirective,
  ClickOutsideDirective,
  LetDirective,
  DownFileDirective,
  AuthDirective,
  AuthNotDirective,
  NgxFor
];
@NgModule({
  declarations: [DIRECTIVE],
  imports: [CommonModule, NzxServiceModule],
  exports: [DIRECTIVE]
})
export class NzxDirectiveModule {}
