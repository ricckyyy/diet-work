import type { Meta, StoryObj } from '@storybook/react';
import { SubComponent } from './index';

const meta: Meta<typeof SubComponent> = {
  title: 'コンポーネント/TestComponent/SubComponent',
  component: SubComponent,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SubComponent>;

export const Default: Story = {
  args: {
    content: 'これはサブコンポーネントです',
  },
};

export const LongContent: Story = {
  args: {
    content: 'これは非常に長いコンテンツを持つサブコンポーネントで、問題を引き起こす可能性があります',
  },
};
