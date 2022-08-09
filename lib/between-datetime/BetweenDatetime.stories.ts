import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenDatetimeComponent } from './between-datetime.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';

export default {
  title: '组件/BetweenDatetime 日期区间',
  component: NzxBetweenDatetimeComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxBetweenDatetimeComponent],
      imports: [NzFormModule, NzxBetweenModule, NzDatePickerModule]
    })
  ],
  args: {},
  argTypes: {
    nzxValue: { table: { disable: true }, control: false, disable: true },
    getDisabledMaxDate: { table: { disable: true }, control: false, disable: true },
    getDisabledTime: { table: { disable: true }, control: false, disable: true },
    nzxStartOnPanelChange: { table: { disable: true }, control: false, disable: true },
    nzxStartOnOpenChange: { table: { disable: true }, control: false, disable: true },
    defaultDisabledTime: { table: { disable: true }, control: false, disable: true },
    nzxStartDisabledDate: { table: { disable: true }, control: false, disable: true },
    nzxEndDisabledDate: { table: { disable: true }, control: false, disable: true },
    getDisabledMinDate: { table: { disable: true }, control: false, disable: true },
    setDisabledState: { table: { disable: true }, control: false, disable: true },
    nzxStartDisabledTime: { table: { disable: true }, control: false, disable: true },
    nzxEndDisabledTime: { table: { disable: true }, control: false, disable: true },
    registerOnChange: { table: { disable: true }, control: false, disable: true },
    registerOnTouched: { table: { disable: true }, control: false, disable: true },
    onChange: { table: { disable: true }, control: false, disable: true },
    onTouched: { table: { disable: true }, control: false, disable: true },
    writeValue: { table: { disable: true }, control: false, disable: true },
    ngModelChange: { table: { disable: true }, control: false, disable: true }
  },
  parameters: {
    controls: {
      exclude: [
        'nzxValue',
        'nzxStartDisabledDate',
        'nzxEndDisabledDate',
        'nzxStartDisabledTime',
        'nzxEndDisabledTime',
        'registerOnChange',
        'registerOnTouched',
        'onChange',
        'onTouched',
        'writeValue',
        'ngModelChange',
      ]
    }
  }
} as Meta;

const Template: Story<NzxBetweenDatetimeComponent> = args => {
  return {
    props: args
  };
};

export const Default = Template.bind({});
Default.args = {};
export const NzxSize = Template.bind({});
NzxSize.args = { nzxSize: 'large' };

export const NzxDisabled = Template.bind({});
NzxDisabled.args = { nzxDisabled: true };

export const NzxStartDisabled = Template.bind({});
NzxStartDisabled.args = { nzxStartDisabled: true };

export const NzxEndDisabled = Template.bind({});
NzxEndDisabled.args = { nzxEndDisabled: true };
