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
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **デプロイ**: Vercel対応済み
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
- PostgreSQL データベース（ローカル or クラウド）

### データベースのセットアップ

開発環境でPostgreSQLを使用するため、以下のいずれかの方法でデータベースを用意してください：

#### オプション1: Dockerを使用（推奨）

```bash
# PostgreSQLをDockerで起動
docker run --name diet-work-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=diet_work \
  -p 5432:5432 \
  -d postgres:16

# .envファイルを作成
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diet_work?schema=public"' > .env
```

#### オプション2: ローカルにPostgreSQLをインストール

システムにPostgreSQLをインストールし、データベースを作成してから `.env` ファイルに接続文字列を設定してください。

#### オプション3: クラウドデータベースを使用

Supabase、Neon、またはVercel Postgresなどのクラウドデータベースサービスを使用し、接続文字列を `.env` ファイルに設定してください。

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd diet-work

# 依存パッケージをインストール
npm install

# .envファイルを作成（.env.exampleを参考に）
cp .env.example .env
# DATABASE_URLを編集

# Prismaのセットアップ
npx prisma generate
npx prisma migrate dev

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください。

## データベース

PostgreSQL を使用しています。開発環境でも本番環境でも同じデータベースエンジンを使用します。

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

## GitHub Actions ワークフロー

### 1. mainブランチの取り込みチェック

このリポジトリでは、プルリクエスト作成時に自動的にmainブランチの最新変更を取り込んでいるかチェックするワークフローが設定されています。

**目的**: プルリクエストがmainブランチの最新変更を含んでいることを確認し、マージ時のコンフリクトを防ぎます。

**動作**:
- プルリクエストが作成、更新、または再オープンされた時に自動実行
- mainブランチの最新コミットがPRブランチに含まれているか確認
- 含まれていない場合はエラーとなり、mainブランチの取り込みが必要

**mainブランチを取り込む方法**:

```bash
# マージを使用する場合
git fetch origin main
git merge origin/main

# リベースを使用する場合
git fetch origin main
git rebase origin/main
```

### 2. バージョン自動更新とリリース作成

mainブランチに変更がプッシュされると、自動的にバージョンをインクリメントしてGitHubリリースを作成します。

**ワークフロー**: `.github/workflows/version-and-release.yml`

**動作**:
1. mainブランチへのプッシュをトリガーに実行
2. package.jsonのバージョンを自動的にパッチバージョンアップ（例: 0.1.0 → 0.1.1）
3. 新しいバージョンでgitタグを作成
4. 前回のリリース以降の変更履歴からリリースノートを自動生成
5. GitHubリリースを公開
6. デプロイ環境選択のIssueが自動作成される

**バージョン管理**:
- パッチバージョンが自動的にインクリメント
- タグ形式: `v0.1.0`, `v0.1.1`, `v0.1.2` など
- リリースノートには変更されたコミットが自動的に含まれる

### 3. デプロイ環境選択

リリース作成後、デプロイ環境を選択してアプリケーションをデプロイできます。

**ワークフロー**: 
- `.github/workflows/deployment-guide.yml` - リリース後に自動でIssue作成
- `.github/workflows/deploy-options.yml` - デプロイ設定を追加

**デプロイ環境の選択肢**:
1. **Vercel** (推奨) - Next.js公式、最も簡単
2. **Netlify** - 多機能、簡単なセットアップ
3. **Cloudflare Pages** - 高速CDN、無制限の帯域幅
4. **Railway** - PostgreSQL統合が簡単
5. **Render** - PostgreSQL統合、自動SSL

**デプロイ設定の追加方法**:
1. リリース作成後に自動で作成されるIssueを確認
2. GitHubの「Actions」タブを開く
3. 「デプロイ環境選択」ワークフローを選択
4. 「Run workflow」をクリックし、希望のデプロイ先を選択
5. 自動的にプルリクエストが作成される
6. PRを確認してマージ
7. 選択したプラットフォームでアカウント作成・設定を行う

**継続的デプロイ**:
デプロイ設定をマージ後、mainブランチへのプッシュで自動的にデプロイされます。

## Vercelへのデプロイ

このアプリケーションは Vercel にデプロイできるように設定されています。

### 前提条件

- [Vercel](https://vercel.com) アカウント
- GitHubとVercelの連携

### デプロイ手順

#### 1. Vercelプロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「Add New...」→「Project」をクリック
3. このGitHubリポジトリを選択
4. 「Import」をクリック

#### 2. 環境変数の設定

Vercel PostgresまたはSupabaseなどのPostgreSQLデータベースを使用します。

プロジェクト設定で以下の環境変数を設定：

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

データベースの準備方法は「データベースの選択肢」セクションを参照してください。

#### 3. ビルド設定の確認

`vercel.json` で以下の設定が適用されます：

- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`
- **Framework**: Next.js

これらの設定により、デプロイ時に自動的にPrisma Clientが生成されます。

#### 4. デプロイの実行

設定が完了したら「Deploy」をクリックします。数分でデプロイが完了し、アプリケーションのURLが発行されます。

### データベースの選択肢

#### オプション1: Vercel Postgres（推奨）

1. Vercel Dashboardでプロジェクトを開く
2. 「Storage」タブをクリック
3. 「Create Database」→「Postgres」を選択
4. データベースが作成され、自動的に `DATABASE_URL` が設定される

#### オプション2: Supabase

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. Database の Connection String を取得
3. Vercelの環境変数に `DATABASE_URL` を設定

#### オプション3: その他のPostgreSQLサービス

Neon、Railway、Renderなど、お好みのPostgreSQLサービスを使用できます。

### マイグレーションの実行

初回デプロイ後にマイグレーションを実行する必要があります：

```bash
# ローカルでマイグレーションを作成
npx prisma migrate dev --name init

# 本番環境でマイグレーションを実行（Vercel CLIを使用）
vercel env pull .env.production
npx prisma migrate deploy
```

### 継続的デプロイ

GitHubの `main` ブランチにプッシュすると、自動的にVercelにデプロイされます。
プルリクエストを作成すると、プレビューデプロイも自動的に作成されます。

### デプロイの確認

デプロイが成功したら、Vercelが発行したURLにアクセスしてアプリケーションの動作を確認してください。

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
# マイグレーションをリセットして再作成
npx prisma migrate reset

# または、マイグレーションを再実行
npx prisma migrate dev
```

### PostgreSQL接続エラー

データベース接続文字列が正しいか確認してください。`.env`ファイルの `DATABASE_URL` を確認し、データベースが起動しているか確認してください。

```bash
# Dockerを使用している場合、PostgreSQLコンテナが起動しているか確認
docker ps | grep postgres
```

## ライセンス

MIT

## 作成者

開発者本人のみの利用を想定した個人プロジェクトです。

