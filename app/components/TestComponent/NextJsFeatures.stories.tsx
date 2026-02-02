import type { Meta, StoryObj } from '@storybook/nextjs';
import Image from 'next/image';
import Link from 'next/link';

// Next.js特有の機能を使ったコンポーネント
function NextJsComponent() {
  return (
    <div className="p-4 space-y-4 border rounded">
      <h2 className="text-xl font-bold">Next.js機能テスト</h2>
      
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

export const デフォルト: Story = {};

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
    </div>
  ),
};
