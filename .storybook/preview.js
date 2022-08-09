import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { CommonModule, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
setCompodocJson(docJson);

registerLocaleData(zh);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  docs: { inlineStories: true },
  options: {
    storySort: {
      order: ['介绍', '组件', '指令', '管道', '服务', '工具类']
    }
  }
};

// 全局模块配置
export const decorators = [
  moduleMetadata({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
    providers: [{ provide: NZ_I18N, useValue: zh_CN }]
  })
];

// 设置所有属性默认值
export const argTypes = {
  nzxSize: {
    control: 'radio',
    options: ['large', 'default', 'small']
  }
};
