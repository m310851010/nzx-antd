import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzxCheckboxComponent, NzxCheckboxOption } from './checkbox.component';
import { EXCLUDE_PARAMS, hideControlArgType, storyFactory } from '@stories';
import { action } from '@storybook/addon-actions';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzxBetweenDatetimeComponent } from '@xmagic/nzx-antd/between-datetime';

export default {
  title: '组件/Checkbox 复选框',
  component: NzxCheckboxComponent,
  decorators: [
    moduleMetadata({
      declarations: [NzxCheckboxComponent],
      imports: [NzCheckboxModule, NzOutletModule]
    })
  ],
  argTypes: {
    ...hideControlArgType<NzxCheckboxComponent>('nzxBlur', 'nzxFocus', 'nzxClick')
  },
  args: {
    nzxBlur: action('nzxBlur'),
    nzxFocus: action('nzxFocus'),
    nzxClick: action('nzxClick'),
    nzxValue: []
  },
  parameters: {
    controls: {
      exclude: EXCLUDE_PARAMS
    }
  }
} as Meta;

const Template = (props: Partial<NzxCheckboxComponent>): Story<NzxCheckboxComponent> => {
  return storyFactory(
    props,
    `<nzx-checkbox [(ngModel)]="nzxValue" [nzxDisabled]="nzxDisabled" [nzxOptions]="nzxOptions" ></nzx-checkbox>`
  );
};

function getNzxOptions(): NzxCheckboxOption[] {
  return Array(5)
    .fill(0)
    .map((v, i) => ({ label: `label-${i}`, value: `value-${i}` }));
}

export const Default = Template({ nzxOptions: getNzxOptions() });

export const Checked = Template({ nzxValue: ['value-1'], nzxOptions: getNzxOptions() });

export const NzxDisabled = Template({ nzxOptions: getNzxOptions(), nzxDisabled: true });

export const HideOption = Template({
  nzxOptions: getNzxOptions().map((v, i) => {
    if (i < 3) {
      v.hide = true;
    }
    return v;
  })
});

export const DisabledOption = Template({
  nzxOptions: getNzxOptions().map((v, i) => {
    if (i == 1) {
      v.disabled = true;
    }
    return v;
  })
});

export const IndeterminateOption = Template({
  nzxOptions: getNzxOptions().map((v, i) => {
    if (i == 1) {
      v.indeterminate = true;
    }
    return v;
  })
});

export const NgModelChangeOption = Template({
  nzxOptions: getNzxOptions().map((v, i) => {
    v.ngModelChange = action('ngModelChange');
    return v;
  })
});
