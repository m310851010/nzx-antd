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
    }
  }
} as Meta;

const Template: Story<NzxBetweenDatetimeComponent> = args => {
  const evt = {
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
    props: { ...args, ...evt }
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

export const StartMinDate = Template.bind({});
const start = new Date();
start.setDate(start.getDate() - 2);
StartMinDate.args = { startMinDateTime: start };

export const EndMaxDateTime = Template.bind({});
EndMaxDateTime.args = { endMaxDateTime: new Date() };

export const ShowTimeStart = Template.bind({});
ShowTimeStart.args = { nzxStartShowTime: true };

export const ShowTimeEnd = Template.bind({});
ShowTimeEnd.args = { nzxEndShowTime: true };

export const ShowTime = Template.bind({});
ShowTime.args = { nzShowTime: true };

export const ShowToday = Template.bind({});
ShowToday.args = { nzShowToday: false };

export const ShowTodayStart = Template.bind({});
ShowTodayStart.args = { nzxStartShowToday: true };

export const ShowTodayEnd = Template.bind({});
ShowTodayEnd.args = { nzxEndShowToday: true };
