import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SIZE_ARG_TYPE } from '@stories';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzxButtonDirective, NzxColorType } from './button.directive';
import { NzSpaceModule } from 'ng-zorro-antd/space';

export default {
  title: '组件/Button 按钮',
  component: NzxButtonDirective,
  decorators: [
    moduleMetadata({
      imports: [NzButtonModule, NzSpaceModule]
    })
  ],
  argTypes: {
    nzSize: SIZE_ARG_TYPE,
    disabled: {
      control: 'boolean'
    },
    nzGhost: {
      control: 'boolean'
    },
    nzxColor: {
      control: 'select',
      options: ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan', ''],
      defaultValue: 'default'
    },
    nzType: {
      control: 'select',
      options: ['primary', 'default', 'dashed', 'link', 'text', ''],
      defaultValue: 'default'
    }
  },
  parameters: {
    docs: {
      // 传给
      moduleName: '',
      importName: ''
    }
  }
} as Meta;

export const Default: Story<{ nzxColor?: NzxColorType } & NzButtonComponent> = args => {
  return {
    props: args,
    template: `
    <div style="margin-bottom: 10px">
        <label class="doc-label">nzxColor</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          [nzxColor]="color" style="margin-right: 10px;">
          {{color}}
        </button>
      </div>

      <div style="margin-bottom: 10px">
        <label class="doc-label">nzGhost</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          nzGhost
          [nzxColor]="color" style="margin-right: 10px; ">
          {{color}}
        </button>
      </div>

      <div style="margin-bottom: 10px">
        <label class="doc-label">dashed</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          nzType="dashed"
          nzGhost
          [nzxColor]="color" style="margin-right: 10px;">
          {{color}}
        </button>
      </div>

       <div style="margin-bottom: 10px">
        <label class="doc-label">text</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          nzType="text"
          [nzxColor]="color" style="margin-right: 10px;">
          {{color}}
        </button>
      </div>

      <div style="margin-bottom: 10px">
        <label class="doc-label">link</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          nzType="link"
          [nzxColor]="color" style="margin-right: 10px;">
          {{color}}
        </button>
      </div>

      <div style="margin-bottom: 10px">
        <label class="doc-label">disabled</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          disabled
          [nzxColor]="color" style="margin-right: 10px;">
          {{color}}
        </button>
      </div>

      <div style="margin-bottom: 10px">
        <label class="doc-label">disabled</label>
        <button
          nz-button
          *ngFor="let color of ['success', 'warning', 'info', 'error', 'gray', 'teal', 'cyan']"
          nzType="dashed"
          nzGhost
          disabled
          [nzxColor]="color" style="margin-right: 10px;">
          {{color}}
        </button>
      </div>
    `
  };
};

const Template: Story<{ nzxColor?: NzxColorType } & NzButtonComponent> = args => {
  return {
    props: args,
    template: `
    <button nz-button [nzSize]="nzSize" [disabled]="disabled" [nzType]="nzType" [nzGhost]="nzGhost" [nzxColor]="nzxColor">
      测试按钮
    </button>
    `
  };
};

export const NzSize = Template.bind({});
NzSize.args = {
  nzSize: 'small'
};

export const NzType = Template.bind({});
NzType.args = {
  nzxColor: 'success'
};

export const NzGhost: Story<{ nzxColor?: NzxColorType } & NzButtonComponent> = args => {
  return {
    props: args,
    template: `
    <div style="padding: 8px; background: #bec8c8;">
      <button nz-button [nzSize]="nzSize" [disabled]="disabled" [nzType]="nzType" [nzGhost]="nzGhost" [nzxColor]="nzxColor">
        测试按钮
      </button>
    </div>
    `
  };
};
NzGhost.args = {
  nzGhost: true,
  nzxColor: 'success'
};
