# ダイエット × 副業 連動アプリ - プロジェクト概要

## 実装完了日
2025年12月23日

## プロジェクトの目的

体重の増減をトリガーとして、副業行動を強制的に発生させる自己管理アプリ。
ダイエットアプリではなく、行動管理アプリとして設計。

## 実装された機能

### 1. データベース層
- **Prisma ORM** + **SQLite** による永続化
- Weight モデル (id, date, value, createdAt, updatedAt)
- 日付ユニーク制約による1日1レコード管理
- マイグレーション履歴の保存

### 2. API層
3つのREST APIエンドポイント:

#### POST /api/weight
- 体重データの保存・更新
- upsert により同日更新に対応
- 日付の00:00:00正規化

#### GET /api/weight/latest
- 最新の体重データを取得
- date DESC でソート

#### GET /api/weight/previous
- 最新の1つ前の体重データを取得
- 前日比計算に使用

### 3. フロントエンド層
- **Next.js App Router** によるシングルページアプリ
- **Tailwind CSS** によるスタイリング
- リアルタイムな前日比計算
- 条件付き副業メッセージ表示

#### 画面要素
- 今日の日付表示 (年月日・曜日)
- 体重入力フィールド (小数点1桁対応)
- 保存ボタン
- 保存結果メッセージ
- 前日比の差分表示
- 副業メッセージ (体重増加時のみ)

### 4. ビジネスロジック
- 前日比が正(増加)の場合のみ副業メッセージを表示
- 減少・変化なしの場合は表示しない
- データ保存後、自動的に最新データを再取得

## 技術選定理由

### Next.js 16 (App Router)
- React Server Components による最適化
- API Routes の統合
- TypeScript 完全サポート
- 開発体験の向上

### Prisma + SQLite
- TypeScript ファーストの ORM
- マイグレーション管理が容易
- SQLite による軽量な開発環境
- PostgreSQL への移行が容易

### Tailwind CSS
- ユーティリティファーストによる高速開発
- 一貫性のあるデザインシステム
- カスタマイズ性の高さ

## ファイル構成

```
diet-work/
├── app/
│   ├── api/
│   │   └── weight/
│   │       ├── route.ts              # POST /api/weight
│   │       ├── latest/route.ts       # GET /api/weight/latest
│   │       └── previous/route.ts     # GET /api/weight/previous
│   ├── page.tsx                      # メイン画面 (Client Component)
│   ├── layout.tsx                    # レイアウト
│   └── globals.css                   # グローバルスタイル
├── lib/
│   └── prisma.ts                     # Prisma Client シングルトン
├── prisma/
│   ├── schema.prisma                 # データベーススキーマ
│   ├── dev.db                        # SQLite データベース (gitignore)
│   └── migrations/
│       └── 20251223124302_init/      # 初期マイグレーション
│           └── migration.sql
├── README.md                         # プロジェクト説明書
├── SPEC.md                          # 本ファイル
├── package.json
├── tsconfig.json
└── .env                              # 環境変数 (DATABASE_URL)
```

## データフロー

```
[ユーザー入力]
    ↓
[フロントエンド: page.tsx]
    ↓ fetch POST /api/weight
[API: /app/api/weight/route.ts]
    ↓ prisma.weight.upsert()
[データベース: prisma/dev.db]
    ↓ レスポンス
[フロントエンド: 再取得]
    ↓ fetch GET /api/weight/latest
    ↓ fetch GET /api/weight/previous
[前日比計算 & 副業判定]
    ↓
[画面更新]
```

## 今後の拡張案 (スコープ外)

1. **データ可視化**
   - 体重推移グラフ (Chart.js / Recharts)
   - 週次・月次サマリー

2. **認証機能**
   - NextAuth.js / Supabase Auth
   - マルチユーザー対応

3. **データベース移行**
   - PostgreSQL / Supabase への移行
   - バックアップ機能

4. **通知機能**
   - 入力リマインダー
   - 副業実行リマインダー

5. **iOS アプリ**
   - React Native / Swift での実装
   - API の再利用

6. **SaaS 化**
   - 有料プラン
   - カスタマイズ機能

## セキュリティ考慮事項 (現状)

- ⚠️ **認証なし**: 単一ユーザー前提のため実装していない
- ⚠️ **CORS制限なし**: ローカル開発環境のみを想定
- ✅ **SQLインジェクション対策**: Prisma による自動エスケープ
- ✅ **型安全性**: TypeScript による型チェック

## パフォーマンス

- Prisma Client のシングルトンパターン
- データ量が小さいため最適化不要
- 将来的にはページネーション・キャッシュの検討

## テスト (未実装)

今後の実装案:
- Unit Test: API ロジックのテスト (Jest)
- Integration Test: API エンドポイントのテスト (Supertest)
- E2E Test: フロントエンドのテスト (Playwright)

## デプロイ

### 推奨デプロイ先
- **Vercel**: Next.js の公式推奨プラットフォーム
- **Railway**: PostgreSQL への移行時に推奨
- **Fly.io**: SQLite をそのまま使用可能

### デプロイ手順 (Vercel)
1. GitHub リポジトリにプッシュ
2. Vercel でプロジェクトをインポート
3. 環境変数を設定 (DATABASE_URL)
4. デプロイ

## 成功基準

- [x] 体重を記録できる
- [x] 前日比を計算できる
- [x] 体重増加時に副業メッセージを表示できる
- [x] データベースに永続化できる
- [x] TypeScript + Prisma の実装実績を作れる
- [x] GitHub に公開できる状態

## ライセンス

MIT License

## 作者

開発者本人の自己管理用アプリとして開発。
