import { Component } from '@angular/core';

@Component({
  selector: 'nzx-page',
  template: '<ng-content></ng-content>',
  host: {
    '[class.nzx-page]': 'true'
  }
})
export class PageComponent {
  constructor() {}
}
