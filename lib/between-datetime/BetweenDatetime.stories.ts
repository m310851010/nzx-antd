import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenDatetimeComponent } from './between-datetime.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';
import { EXCLUDE_PARAMS, hideControlArgType, SIZE_ARG_TYPE, storyFactory } from '@stories';
import { action } from '@storybook/addon-actions';
import DocPage from './BetweenDatetime.stories.mdx';

console.log(DocPage);
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
  args: {
    nzxStartOnOpenChange: action('nzxStartOnOpenChange'),
    nzxEndOnOpenChange: action('nzxEndOnOpenChange'),
    nzxStartOnOk: action('nzxStartOnOk'),
    nzxEndOnOk: action('nzxEndOnOk'),
    nzxStartOnCalendarChange: action('nzxStartOnCalendarChange'),
    nzxEndOnCalendarChange: action('nzxEndOnCalendarChange'),
    nzxStartOnPanelChange: action('nzxStartOnPanelChange'),
    nzxEndOnPanelChange: action('nzxEndOnPanelChange')
  },
  parameters: {
    docs: {
      page: DocPage.parameters.docs.page
    },
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

const Template: (props?: Partial<NzxBetweenDatetimeComponent>) => Story<NzxBetweenDatetimeComponent> = storyFactory;

export const Default = Template();

export const NzxSize = Template({ nzxSize: 'large' });

export const NzxDisabled = Template({ nzxDisabled: true });

export const NzxStartDisabled = Template({ nzxStartDisabled: true });

export const NzxEndDisabled = Template({ nzxEndDisabled: true });

const start = new Date();
start.setDate(start.getDate() - 2);
export const StartMinDate = Template({ startMinDateTime: start });

export const EndMaxDateTime = Template({ endMaxDateTime: new Date() });

export const ShowTimeStart = Template({ nzxStartShowTime: true });

export const ShowTimeEnd = Template({ nzxEndShowTime: true });

export const ShowTime = Template({ nzShowTime: true });

export const ShowToday = Template({ nzShowToday: true });

export const ShowTodayStart = Template({ nzxStartShowToday: true });

export const ShowTodayEnd = Template({ nzxEndShowToday: true });

export const NzMode = Template({ nzMode: 'week' });

export const NzAllowClear = Template({ nzAllowClear: true });
