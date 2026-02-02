import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Next.js特有の機能を使ったコンポーネント
interface NextJsComponentProps {
  showCounter?: boolean;
  showImage?: boolean;
  showLink?: boolean;
  title?: string;
  onClick?: () => void;
}

function NextJsComponent({ 
  showCounter = true, 
  showImage = true, 
  showLink = true,
  title = 'Next.js機能テスト',
  onClick
}: NextJsComponentProps) {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
    onClick?.();
  };
  
  return (
    <div className="p-4 space-y-4 border rounded">
      <h2 className="text-xl font-bold">{title}</h2>
      
      {/* カウンターボタン */}
      {showCounter && (
        <div>
          <h3 className="font-semibold">インタラクションテスト:</h3>
          <button 
            onClick={handleClick}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            クリック数: {count}
          </button>
        </div>
      )}
      
      {/* next/image */}
      {showImage && (
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
      )}
      
      {/* next/link */}
      {showLink && (
        <div>
          <h3 className="font-semibold">next/link:</h3>
          <Link href="/" className="text-blue-500 underline">
            ホームに戻る
          </Link>
        </div>
      )}
      
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
  argTypes: {
    showCounter: { control: 'boolean' },
    showImage: { control: 'boolean' },
    showLink: { control: 'boolean' },
    title: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof NextJsComponent>;

export const デフォルト: Story = {
  args: {
    showCounter: true,
    showImage: true,
    showLink: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /クリック数/ });
    
    // ボタンをクリックしてカウントが増えることを確認
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック数: 1');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック数: 2');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const 画像テスト: Story = {
  args: {
    title: 'Next.js Image最適化',
    showCounter: false,
    showImage: true,
    showLink: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 画像が表示されていることを確認
    const image = canvas.getByRole('img', { name: /Vercel Logo/ });
    await expect(image).toBeInTheDocument();
  },
};

export const リンクナビゲーション: Story = {
  args: {
    title: 'ナビゲーションリンク',
    showCounter: false,
    showImage: false,
    showLink: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // リンクが存在することを確認
    const homeLink = canvas.getByRole('link', { name: /ホームに戻る/ });
    await expect(homeLink).toBeInTheDocument();
  },
};

export const 複数インタラクション: Story = {
  args: {
    title: '複数の機能テスト',
    showCounter: true,
    showImage: true,
    showLink: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // ボタンをクリック
    const button = canvas.getByRole('button', { name: /クリック数/ });
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック数: 1');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    
    await userEvent.click(button);
    await expect(button).toHaveTextContent('クリック数: 2');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    
    // 画像が表示されていることを確認
    const image = canvas.getByRole('img', { name: /Vercel Logo/ });
    await expect(image).toBeInTheDocument();
    
    // リンクが存在することを確認
    const homeLink = canvas.getByRole('link', { name: /ホームに戻る/ });
    await expect(homeLink).toBeInTheDocument();
  },
};
