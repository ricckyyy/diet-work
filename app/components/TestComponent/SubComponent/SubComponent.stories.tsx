import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // ボタンを見つける
    const button = canvas.getByRole('button', { name: /クリックしてください/ });
    
    // ボタンをクリック
    await userEvent.click(button);
    
    // ボタンのテキストが変わったことを確認
    await expect(button).toHaveTextContent(/クリック済み/);
    
    // もう一度クリック
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック済み (2回)');
  },
};

export const LongContent: Story = {
  args: {
    content: 'これは非常に長いコンテンツを持つサブコンポーネントで、問題を引き起こす可能性があります',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // ボタンを見つけてクリック
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    
    // クリック後の状態を確認
    await expect(button).toHaveTextContent(/クリック済み/);
    
    // 複数回クリックをテスト
    await userEvent.click(button);
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック済み (3回)');
  },
};

export const 複数クリックテスト: Story = {
  args: {
    content: '複数回クリックをテストします',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // 5回クリック
    for (let i = 1; i <= 5; i++) {
      await userEvent.click(button);
      await expect(button).toHaveTextContent(`クリック済み (${i}回)`);
    }
  },
};
