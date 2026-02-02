import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // Next.js App Routerのストーリーをスキャン
  stories: ['../app/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  
  framework: {
    name: '@storybook/nextjs',
    options: {
      // Next.jsのビルダーオプション
      builder: {
        useSWC: true, // 高速コンパイル
      },
    },
  },
  
  docs: {
    autodocs: 'tag',
  },
  
  // Next.jsの機能を有効化
  staticDirs: ['../public'],
};

export default config;