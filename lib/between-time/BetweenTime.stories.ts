import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenTimeComponent } from './between-time.component';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';
import { EXCLUDE_PARAMS, hideControlArgType, SIZE_ARG_TYPE, storyFactory } from '@stories';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

export default {
  title: '组件/BetweenDatetime 时间区间',
  component: NzxBetweenTimeComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxBetweenTimeComponent],
      imports: [NzTimePickerModule, NzxBetweenModule]
    })
  ],
  argTypes: {
    nzxSize: SIZE_ARG_TYPE,
    nzxEndStatus: { control: 'inline-radio', options: ['', 'error', 'warning'], defaultValue: '' },
    ...hideControlArgType<NzxBetweenTimeComponent>('nzxEndOpenChange', 'nzxStartOpenChange')
  },
  parameters: {
    controls: {
      exclude: [
        ...EXCLUDE_PARAMS,
        'nzxStartDisabledHours',
        'nzxStartDisabledMinutes',
        'nzxStartDisabledSeconds',
        'nzxEndDisabledHours',
        'nzxEndDisabledMinutes',
        'nzxEndDisabledSeconds',
        'getDefaultMinValue',
        'getDefaultMaxValue',
        'getDisabledHour',
        'getDisabledMinutes',
        'getDisabledSeconds',
        'nzDefaultOpenValue'
      ]
    }
  }
} as Meta;

const Template: (props?: Partial<NzxBetweenTimeComponent>) => Story<NzxBetweenTimeComponent> = storyFactory;

export const Default = Template();

export const NzxSize = Template({ nzxSize: 'large' });

export const NzxDisabled = Template({ nzxDisabled: true });

export const NzxStartDisabled = Template({ nzxStartDisabled: true });

export const NzxEndDisabled = Template({ nzxEndDisabled: true });
