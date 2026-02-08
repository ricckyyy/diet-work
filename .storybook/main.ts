import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    // TypeScriptサポートを追加
    if (config.resolve) {
      config.resolve.extensions = [
        ...(config.resolve.extensions || []),
        '.ts',
        '.tsx',
      ];
      
      // パスエイリアスのサポートを追加
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
      };
    }
    
    // TypeScriptローダーを追加
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // js/jsx/ts/tsx用のルールを追加してTypeScriptが処理されるようにする
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-typescript'),
              [
                require.resolve('@babel/preset-react'),
                {
                  runtime: 'automatic',
                },
              ],
            ],
          },
        },
      ],
    });
    
    return config;
  },
};

export default config;
