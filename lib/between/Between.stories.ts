import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenComponent } from './between.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SIZE_ARG_TYPE } from '@stories';

export default {
  title: '组件/Between 区间',
  component: NzxBetweenComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxBetweenComponent],
      imports: [NzInputModule, NzSelectModule, NzDatePickerModule, NzFormModule]
    })
  ],
  argTypes: {
    nzxSize: SIZE_ARG_TYPE
  },
  parameters: {
    docs: {
      // 传给
      moduleName: '',
      importName: ''
    }
  }
} as Meta;

const Template: Story<NzxBetweenComponent> = args => {
  return {
    props: args,
    template: `
    <nzx-between
      [nzxSize]="nzxSize"
      [nzxDisabled]="nzxDisabled"
      [nzxEndDisabled]="nzxEndDisabled"
      [nzxStartDisabled]="nzxStartDisabled">
       <input nz-input start placeholder="开始控件" [disabled]="nzxDisabled || nzxStartDisabled">
       <input nz-input end placeholder="结束控件" [disabled]="nzxDisabled || nzxEndDisabled">
    </nzx-between>
    `
  };
};

export const NzxSize = Template.bind({});
NzxSize.storyName = 'Nzx Size';
NzxSize.args = {
  nzxSize: 'small'
};

export const NzxDisabled = Template.bind({});
NzxDisabled.args = {
  nzxDisabled: true
};

export const NzxStartDisabled = Template.bind({});
NzxStartDisabled.args = {
  nzxStartDisabled: true
};

export const NzxEndDisabled = Template.bind({});
NzxEndDisabled.args = {
  nzxEndDisabled: true
};

// select控件
export const SelectControl: Story = args => {
  return {
    props: args,
    template: `
    <nzx-between  [nzxSize]="nzxSize"
      [nzxDisabled]="nzxDisabled"
      [nzxEndDisabled]="nzxEndDisabled"
      [nzxStartDisabled]="nzxStartDisabled">
       <nz-select start nzPlaceHolder="开始控件" [nzOptions]="nzOptions" [nzDisabled]="nzxDisabled || nzxStartDisabled"></nz-select>
       <nz-select end nzPlaceHolder="结束控件" [nzOptions]="nzOptions" [nzDisabled]="nzxDisabled || nzxEndDisabled"></nz-select>
    </nzx-between>
    `
  };
};
SelectControl.args = {
  nzOptions: Array.from({ length: 10 }).map((it, i) => ({ label: `选项-${i + 1}`, value: i }))
};

// DatePicker控件
export const DatePickerControl: Story<NzxBetweenComponent> = args => {
  return {
    props: args,
    template: `
    <nzx-between  [nzxSize]="nzxSize"
      [nzxDisabled]="nzxDisabled"
      [nzxEndDisabled]="nzxEndDisabled"
      [nzxStartDisabled]="nzxStartDisabled">
       <nz-date-picker start nzPlaceHolder="开始控件" [nzSize]="nzxSize" [nzDisabled]="nzxDisabled || nzxStartDisabled"></nz-date-picker>
       <nz-date-picker end nzPlaceHolder="结束控件" [nzSize]="nzxSize" [nzDisabled]="nzxDisabled || nzxEndDisabled"></nz-date-picker>
    </nzx-between>
    `
  };
};

// WidthFormItem
export const WidthFormItem: Story<NzxBetweenComponent> = args => {
  return {
    props: args,
    template: `
    <nz-form-item>
      <nz-form-label>label1</nz-form-label>
      <nz-form-control>
        <nzx-between  [nzxSize]="nzxSize"
          [nzxDisabled]="nzxDisabled"
          [nzxEndDisabled]="nzxEndDisabled"
          [nzxStartDisabled]="nzxStartDisabled">
            <input nz-input start placeholder="开始控件" [disabled]="nzxDisabled || nzxStartDisabled">
            <input nz-input end placeholder="结束控件" [disabled]="nzxDisabled || nzxEndDisabled">
        </nzx-between>
      </nz-form-control>
    </nz-form-item>
    `
  };
};
