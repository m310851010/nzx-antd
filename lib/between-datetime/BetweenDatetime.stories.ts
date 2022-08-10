import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenDatetimeComponent } from './between-datetime.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';
import { EXCLUDE_PARAMS, hideControlArgType, SIZE_ARG_TYPE } from '@stories';
import { action } from '@storybook/addon-actions';

export default {
  title: '组件/BetweenDatetime 日期区间',
  component: NzxBetweenDatetimeComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxBetweenDatetimeComponent],
      imports: [NzFormModule, NzxBetweenModule, NzDatePickerModule]
    })
  ],
  argTypes: {
    nzxSize: SIZE_ARG_TYPE,
    nzMode: { control: 'select', options: ['date', 'week', 'month', 'year'] },
    defaultDisabledTime: { table: { disable: true } },
    nzShowTime: { control: { type: 'boolean' }, type: 'boolean' },
    nzxStartShowTime: { control: { type: 'boolean' }, type: 'boolean' },
    nzxEndShowTime: { control: { type: 'boolean' }, type: 'boolean' },
    nzLocale: { control: false },
    ...hideControlArgType<NzxBetweenDatetimeComponent>(
      'nzxStartOnOpenChange',
      'nzxEndOnOpenChange',
      'nzxStartOnOk',
      'nzxEndOnOk',
      'nzxStartOnCalendarChange',
      'nzxEndOnCalendarChange',
      'nzxStartOnPanelChange',
      'nzxEndOnPanelChange'
    )
  },
  parameters: {
    controls: {
      exclude: [
        'nzxStartDisabledDate',
        'nzxEndDisabledDate',
        'nzxStartDisabledTime',
        'nzxEndDisabledTime',
        'getDisabledMaxDate',
        'getDisabledMinDate',
        'getDisabledTime',
        ...EXCLUDE_PARAMS
      ]
    },
  }
} as Meta;

const Template: Story<NzxBetweenDatetimeComponent> = args => {
  const evts = {
    nzxStartOnOpenChange: action('nzxStartOnOpenChange'),
    nzxEndOnOpenChange: action('nzxEndOnOpenChange'),
    nzxStartOnOk: action('nzxStartOnOk'),
    nzxEndOnOk: action('nzxEndOnOk'),
    nzxStartOnCalendarChange: action('nzxStartOnCalendarChange'),
    nzxEndOnCalendarChange: action('nzxEndOnCalendarChange'),
    nzxStartOnPanelChange: action('nzxStartOnPanelChange'),
    nzxEndOnPanelChange: action('nzxEndOnPanelChange')
  };
  return {
    props: { ...args, ...evts }
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
