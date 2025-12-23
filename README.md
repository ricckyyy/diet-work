# ダイエット × 副業 連動アプリ

体重の増減をトリガーとして、副業行動を強制的に発生させる自己管理アプリ

## 概要

このアプリは、ダイエットを目的とするアプリではありません。  
**体重の増減をトリガーとして、副業行動を強制的に発生させる自己管理アプリ**です。

### 特徴

- 健康・美容・モチベーション訴求は行わない
- 数値と行動のみを扱う
- シンプルで継続しやすい設計

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: SQLite (Prisma ORM)
- **認証**: なし (MVP では単一ユーザー前提)

## 機能

### 実装済み (MVP)

- ✅ 体重の入力・保存 (1日1回、小数点1桁まで)
- ✅ 前日比の自動計算
- ✅ 体重増加時の副業メッセージ表示
- ✅ データの自動保存 (同日更新可能)

### 将来拡張予定 (本仕様外)

- グラフ表示
- PostgreSQL / Supabase 対応
- 認証機能
- iOS アプリ展開
- SaaS 化

## セットアップ

### 必要要件

- Node.js 20.9.0 以上 (推奨: 20.x LTS)
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd diet-work

# 依存パッケージをインストール
npm install

# Prismaのセットアップ
npx prisma generate
npx prisma migrate dev

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください。

## データベース

SQLite を使用しています。データは `prisma/dev.db` に保存されます。

### マイグレーション

スキーマを変更した場合:

```bash
npx prisma migrate dev --name <migration-name>
```

### データベースの確認

```bash
npx prisma studio
```

## プロジェクト構成

```
diet-work/
├── app/
│   ├── api/
│   │   └── weight/
│   │       ├── route.ts           # POST /api/weight
│   │       ├── latest/
│   │       │   └── route.ts       # GET /api/weight/latest
│   │       └── previous/
│   │           └── route.ts       # GET /api/weight/previous
│   ├── page.tsx                   # メイン画面
│   └── layout.tsx
├── lib/
│   └── prisma.ts                  # Prisma Client インスタンス
├── prisma/
│   ├── schema.prisma              # データベーススキーマ
│   ├── dev.db                     # SQLite データベース
│   └── migrations/                # マイグレーション履歴
└── package.json
```

## API エンドポイント

### POST /api/weight

体重データを保存・更新

**リクエスト:**
```json
{
  "date": "2025-12-23T00:00:00.000Z",
  "value": 65.5
}
```

**レスポンス:**
```json
{
  "id": 1,
  "date": "2025-12-23T00:00:00.000Z",
  "value": 65.5,
  "createdAt": "2025-12-23T12:00:00.000Z",
  "updatedAt": "2025-12-23T12:00:00.000Z"
}
```

### GET /api/weight/latest

最新の体重データを取得

### GET /api/weight/previous

最新の1つ前の体重データを取得

## 使い方

1. アプリを開く
2. 今日の体重を入力 (小数点1桁まで)
3. 「保存」ボタンをクリック
4. 前日比が表示される
5. 体重が増加している場合、「副業タイム」メッセージが表示される

## 開発メモ

### データの保持について

- 同じ日付で複数回入力した場合、最新の値で上書きされます
- 日付は自動的に 00:00:00 に正規化されます

### 副業メッセージの表示条件

前日比で体重が増加した場合のみ表示されます:
- 増加 → メッセージ表示
- 減少 → 表示なし
- 変化なし → 表示なし

## トラブルシューティング

### Node.js のバージョンが古い

Next.js 16 は Node.js 20.9.0 以上が必要です。

```bash
# nvmを使用している場合
nvm install 20
nvm use 20

# nodenvを使用している場合
nodenv install 20.9.0
nodenv local 20.9.0
```

### データベースエラー

```bash
# データベースをリセット
rm prisma/dev.db
npx prisma migrate dev
```

## ライセンス

MIT

## 作成者

開発者本人のみの利用を想定した個人プロジェクトです。

