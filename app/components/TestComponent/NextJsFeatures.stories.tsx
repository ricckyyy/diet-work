import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, within } from '@storybook/test';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Next.js特有の機能を使ったコンポーネント
function NextJsComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 space-y-4 border rounded">
      <h2 className="text-xl font-bold">Next.js機能テスト</h2>
      
      {/* カウンターボタン */}
      <div>
        <h3 className="font-semibold">インタラクションテスト:</h3>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          クリック数: {count}
        </button>
      </div>
      
      {/* next/image */}
      <div>
        <h3 className="font-semibold">next/image:</h3>
        <Image 
          src="/vercel.svg" 
          alt="Vercel Logo" 
          width={100} 
          height={24}
          priority
        />
      </div>
      
      {/* next/link */}
      <div>
        <h3 className="font-semibold">next/link:</h3>
        <Link href="/" className="text-blue-500 underline">
          ホームに戻る
        </Link>
      </div>
      
      <p className="text-sm text-gray-600">
        ✅ このストーリーは @storybook/nextjs でのみ正しく動作します
      </p>
    </div>
  );
}

const meta: Meta<typeof NextJsComponent> = {
  title: 'コンポーネント/NextJS機能',
  component: NextJsComponent,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NextJsComponent>;

export const デフォルト: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /クリック数/ });
    
    // ボタンをクリックしてカウントが増えることを確認
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック数: 1');
    
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック数: 2');
  },
};

export const 画像テスト: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="mb-2 font-bold">Next.js Image最適化</h3>
      <Image 
        src="/vercel.svg" 
        alt="Vercel Logo" 
        width={200} 
        height={48}
        priority
      />
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        画像読み込み確認
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /画像読み込み確認/ });
    
    // ボタンがクリック可能であることを確認
    await userEvent.click(button);
    await expect(button).toBeInTheDocument();
  },
};

export const リンクナビゲーション: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <h3 className="font-bold">ナビゲーションリンク</h3>
      <div className="space-y-2">
        <Link href="/" className="block text-blue-500 underline">
          ホーム
        </Link>
        <Link href="/about" className="block text-blue-500 underline">
          について
        </Link>
        <Link href="/contact" className="block text-blue-500 underline">
          お問い合わせ
        </Link>
      </div>
      <button className="px-4 py-2 bg-purple-500 text-white rounded">
        リンク確認
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /リンク確認/ });
    
    // ボタンをクリック
    await userEvent.click(button);
    
    // リンクが存在することを確認
    const homeLink = canvas.getByRole('link', { name: /ホーム/ });
    await expect(homeLink).toBeInTheDocument();
  },
};

export const 複数インタラクション: Story = {
  render: () => {
    const [text, setText] = useState('初期テキスト');
    
    return (
      <div className="p-4 space-y-4">
        <h3 className="font-bold">複数のインタラクション</h3>
        <p className="text-gray-700">{text}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => setText('ボタン1がクリックされました')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            ボタン1
          </button>
          <button 
            onClick={() => setText('ボタン2がクリックされました')}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            ボタン2
          </button>
          <button 
            onClick={() => setText('初期テキスト')}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            リセット
          </button>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // ボタン1をクリック
    const button1 = canvas.getByRole('button', { name: /ボタン1/ });
    await userEvent.click(button1);
    await expect(canvas.getByText('ボタン1がクリックされました')).toBeInTheDocument();
    
    // ボタン2をクリック
    const button2 = canvas.getByRole('button', { name: /ボタン2/ });
    await userEvent.click(button2);
    await expect(canvas.getByText('ボタン2がクリックされました')).toBeInTheDocument();
    
    // リセットボタンをクリック
    const resetButton = canvas.getByRole('button', { name: /リセット/ });
    await userEvent.click(resetButton);
    await expect(canvas.getByText('初期テキスト')).toBeInTheDocument();
  },
};
