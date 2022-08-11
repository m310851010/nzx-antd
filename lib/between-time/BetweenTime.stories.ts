import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenTimeComponent } from './between-time.component';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';
import { EXCLUDE_PARAMS, SIZE_ARG_TYPE, storyFactory } from '@stories';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

export default {
  title: '组件/BetweenDatetime 时间区间',
  component: NzxBetweenTimeComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxBetweenTimeComponent],
      imports: [NzxBetweenModule, NzInputModule, NzInputNumberModule]
    })
  ],
  args: {
    nzxStartFormatter: (v: number | string) => v,
    nzxEndFormatter: (v: number | string) => v
  },
  argTypes: {
    nzxSize: SIZE_ARG_TYPE,
    nzxType: { control: 'inline-radio' },
    nzxStartMax: { control: 'number' },
    nzxEndMax: { control: 'number' },
    nzxStartMin: { control: 'number' },
    nzxEndMin: { control: 'number' }
  },
  parameters: {
    controls: {
      exclude: EXCLUDE_PARAMS
    }
  }
} as Meta;

const Template: (props?: Partial<NzxBetweenTimeComponent>) => Story<NzxBetweenTimeComponent> = storyFactory;

export const Default = Template();

export const NzxSize = Template({ nzxSize: 'large' });

export const NzxDisabled = Template({ nzxDisabled: true });

export const NzxStartDisabled = Template({ nzxStartDisabled: true });

export const NzxEndDisabled = Template({ nzxEndDisabled: true });
