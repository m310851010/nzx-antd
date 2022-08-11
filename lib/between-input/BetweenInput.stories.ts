import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxBetweenInputComponent } from './between-input.component';
import { NzxBetweenModule } from '@xmagic/nzx-antd/between';
import { EXCLUDE_PARAMS, SIZE_ARG_TYPE, storyFactory } from '@stories';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

export default {
  title: '组件/BetweenInput 输入框区间',
  component: NzxBetweenInputComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxBetweenInputComponent],
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

const Template: (props?: Partial<NzxBetweenInputComponent>) => Story<NzxBetweenInputComponent> = storyFactory;

export const Default = Template();

export const NzxSize = Template({ nzxSize: 'large' });

export const NzxDisabled = Template({ nzxDisabled: true });

export const NzxStartDisabled = Template({ nzxStartDisabled: true });

export const NzxEndDisabled = Template({ nzxEndDisabled: true });

export const NzxType = Template({ nzxType: 'number' });
