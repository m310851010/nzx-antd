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
  argTypes: {},
  parameters: {
    nzxSize: 'default'
  }
} as Meta;

const Template: Story<NzxBetweenDatetimeComponent> = args => {
  return {
    props: args
  };
};

export const Default = Template.bind({});
export const NzxSize = Template.bind({});
NzxSize.args = { nzxSize: 'large' };

export const NzxDisabled = Template.bind({});
NzxDisabled.args = { nzxDisabled: true };

export const NzxStartDisabled = Template.bind({});
NzxStartDisabled.args = { nzxStartDisabled: true };

export const NzxEndDisabled = Template.bind({});
NzxEndDisabled.args = { nzxEndDisabled: true };
