import type { Meta, StoryObj } from '@storybook/react';
import { SubComponent } from './index';

const meta: Meta<typeof SubComponent> = {
  title: 'Components/TestComponent/SubComponent',
  component: SubComponent,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SubComponent>;

export const Default: Story = {
  args: {
    content: 'This is a sub component',
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a sub component with a very long content that might cause issues',
  },
};
