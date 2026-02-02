import type { Meta, StoryObj } from '@storybook/react';
import { TestComponent } from './index';

const meta: Meta<typeof TestComponent> = {
  title: 'Components/TestComponent',
  component: TestComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TestComponent>;

// 1つ目のテスト - これは通常成功する
export const First: Story = {
  args: {
    title: 'First Test',
  },
};

// 2つ目のテスト - ここでタイムアウトする可能性がある
export const Second: Story = {
  args: {
    title: 'Second Test',
  },
};

// 3つ目のテスト - 追加のテストケース
export const Third: Story = {
  args: {
    title: 'Third Test',
  },
};
