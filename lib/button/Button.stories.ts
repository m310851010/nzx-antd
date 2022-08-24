import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SIZE_ARG_TYPE } from '@stories';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzxButtonDirective, NzxColorType } from './button.directive';

export default {
  title: '组件/Button 按钮',
  component: NzxButtonDirective,
  decorators: [
    moduleMetadata({
      imports: [NzButtonModule, NzSelectModule, NzDatePickerModule, NzFormModule]
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
      options: ['success', 'warning', 'info', 'error', 'gray', 'teal', ''],
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

const Template: Story<{ nzxColor?: NzxColorType } & Omit<NzButtonComponent, 'nzType'>> = args => {
  return {
    props: args,
    template: `
    <button nz-button [nzSize]="nzSize" [disabled]="disabled" [nzType]="nzType" [nzGhost]="nzGhost" [nzxColor]="nzxColor">
      {{ '默认值'}}
    </button>
    `
  };
};

export const Default = Template.bind({});

export const NzSize = Template.bind({});
NzSize.args = {
  nzSize: 'small'
};

export const NzType = Template.bind({});
NzType.args = {
  nzxColor: 'success'
};

export const NzGhost: Story<{ nzxColor?: NzxColorType } & Omit<NzButtonComponent, 'nzType'>> = args => {
  return {
    props: args,
    template: `
    <div style="padding: 8px; background: #bec8c8;">
      <button nz-button [nzSize]="nzSize" [disabled]="disabled" [nzType]="nzType" [nzGhost]="nzGhost" [nzxColor]="nzxColor">
        {{ '默认值'}}
      </button>
    </div>
    `
  };
};
NzGhost.args = {
  nzGhost: true
};
