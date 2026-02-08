import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // クリーンアップ処理を追加してタイムアウト問題をデバッグ
    await page.evaluate(() => {
      // タイマーのクリア
      const highestId = window.setTimeout(() => {}, 0);
      window.clearTimeout(highestId);
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    });
    
    console.log(`✅ [Vite] ストーリーテスト完了: ${context.title}`);
  },
  async preVisit(page, context) {
    console.log(`🧪 [Vite] ストーリーテスト開始: ${context.title}`);
  },
};

export default config;
