# Storybook テスト環境セットアップ

このドキュメントは、Storybookのテスト環境のセットアップ方法と使用方法について説明します。

## 概要

このプロジェクトでは、「2つ目のStorybookテストでタイムアウトする」問題を再現し、デバッグするための環境を構築しました。

## インストール済みのパッケージ

以下のパッケージがインストールされています:

- `@storybook/react` - React用Storybookコア
- `@storybook/react-webpack5` - Webpack5ベースのビルダー (Next.js 16との互換性のため)
- `@storybook/test-runner` - Playwrightベースのテストランナー
- `@storybook/addon-interactions` - インタラクションテスト用アドオン
- `@storybook/addon-essentials` - 必須アドオンのコレクション
- `@storybook/test` - テストユーティリティ
- `playwright` / `@playwright/test` - ブラウザ自動化とテスト
- `babel-loader`, `@babel/preset-typescript`, `@babel/preset-react` - TypeScript/React変換

## 設定ファイル

### .storybook/main.ts

- `app/**/*.stories.@(js|jsx|ts|tsx)` パターンでストーリーファイルを検索
- Webpack5とTypeScriptサポートを有効化
- 自動JSXランタイムを使用してReactインポートを不要に
- パスエイリアス `@/` をサポート

### .storybook/preview.ts

- Tailwind CSSのグローバルスタイルを読み込み
- カラーとデータマッチャーの設定

### .storybook/test-runner.ts

- `preVisit`: 各ストーリーテスト開始時にログ出力 🧪
- `postVisit`: 各ストーリーテスト完了時にログ出力 ✅
- タイマーのクリーンアップ処理でタイムアウト問題をデバッグ

## テストコンポーネント

### TestComponent

- `app/components/TestComponent/index.tsx` - メインのテストコンポーネント
- `app/components/TestComponent/TestComponent.stories.tsx` - 3つのストーリー:
  - First - 1つ目のテスト
  - Second - 2つ目のテスト（タイムアウト検証用）
  - Third - 3つ目のテスト

### SubComponent

- `app/components/TestComponent/SubComponent/index.tsx` - サブコンポーネント
- `app/components/TestComponent/SubComponent/SubComponent.stories.tsx` - 2つのストーリー:
  - Default - デフォルトコンテンツ
  - LongContent - 長いコンテンツ

## 使用方法

### 1. Storybookの起動

```bash
npm run storybook
```

ブラウザで http://localhost:6006 を開くとStorybookが表示されます。

### 2. Storybookのビルド

```bash
npm run build-storybook
```

静的ファイルが `storybook-static/` ディレクトリに生成されます。

### 3. テストの実行

```bash
npm run test-storybook
```

すべてのストーリーがテストされます。コンソール出力で各ストーリーのテスト開始/完了を確認できます。

### 4. ウォッチモードでテスト

```bash
npm run test-storybook:watch
```

ファイルの変更を監視し、自動的にテストを再実行します。

### 5. デバッグモードでテスト

```bash
npm run test-storybook:debug
```

詳細なデバッグ情報を出力しながらテストを実行します。

### 6. 特定のストーリーのみテスト

```bash
npm run test-storybook -- --stories-glob="**/TestComponent.stories.tsx"
```

## デバッグ方法

タイムアウトが発生した場合:

1. **デバッグモードで実行**
   ```bash
   npm run test-storybook:debug
   ```

2. **コンソールログを確認**
   - 🧪 マークでテスト開始
   - ✅ マークでテスト完了
   - どのストーリーでタイムアウトが発生するか特定

3. **特定のストーリーファイルをテスト**
   ```bash
   npm run test-storybook -- --stories-glob="**/SubComponent.stories.tsx"
   ```

4. **Storybookを直接開いて確認**
   - http://localhost:6006/?path=/story/components-testcomponent--second
   - ブラウザの開発者ツールでエラーを確認

## 注意事項

### Next.js 16との互換性

- Storybook 8.5は公式にはNext.js 16をサポートしていないため、`@storybook/nextjs` の代わりに `@storybook/react-webpack5` を使用
- `npm install` 時に `--legacy-peer-deps` フラグが必要

### Playwright

- テストランナーはPlaywright Chromiumを使用
- `npx playwright install chromium` でブラウザをインストール済み

## テスト結果

現時点では、すべてのストーリー（5つ）が正常にテストされています:
- ✅ Components/TestComponent/SubComponent - Default
- ✅ Components/TestComponent/SubComponent - LongContent  
- ✅ Components/TestComponent - First
- ✅ Components/TestComponent - Second
- ✅ Components/TestComponent - Third

タイムアウト問題は発生していません。

## トラブルシューティング

### タイムアウトエラーが発生する場合

1. `.storybook/test-runner.ts` の `postVisit` 内のクリーンアップ処理を確認
2. 各ストーリーのレンダリング時間を確認
3. 非同期処理が適切にクリーンアップされているか確認

### ビルドエラーが発生する場合

1. `node_modules` を削除して再インストール
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. Storybookのキャッシュをクリア
   ```bash
   rm -rf node_modules/.cache
   ```

## 参考リンク

- [Storybook公式ドキュメント](https://storybook.js.org/docs/react/get-started/introduction)
- [Storybook Test Runner](https://storybook.js.org/docs/react/writing-tests/test-runner)
- [Playwright公式ドキュメント](https://playwright.dev/)
