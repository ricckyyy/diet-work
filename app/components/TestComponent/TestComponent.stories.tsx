import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { TestComponent } from './index';

const meta: Meta<typeof TestComponent> = {
  title: 'コンポーネント/TestComponent',
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
    title: '最初のテスト',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // コンポーネントが表示されることを確認
    const heading = canvas.getByRole('heading', { name: '最初のテスト' });
    await expect(heading).toBeInTheDocument();
    
    // テキストが表示されることを確認
    const text = canvas.getByText('これはテストコンポーネントです');
    await expect(text).toBeInTheDocument();
  },
};

// 2つ目のテスト - ここでタイムアウトする可能性がある
export const Second: Story = {
  args: {
    title: '2つ目のテスト',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // コンポーネントが表示されることを確認
    const heading = canvas.getByRole('heading', { name: '2つ目のテスト' });
    await expect(heading).toBeInTheDocument();
    
    // テキストが表示されることを確認
    const text = canvas.getByText('これはテストコンポーネントです');
    await expect(text).toBeInTheDocument();
  },
};

// 3つ目のテスト - 追加のテストケース
export const Third: Story = {
  args: {
    title: '3つ目のテスト',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // コンポーネントが表示されることを確認
    const heading = canvas.getByRole('heading', { name: '3つ目のテスト' });
    await expect(heading).toBeInTheDocument();
    
    // テキストが表示されることを確認
    const text = canvas.getByText('これはテストコンポーネントです');
    await expect(text).toBeInTheDocument();
  },
};
