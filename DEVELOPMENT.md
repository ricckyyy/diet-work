# 開発環境セットアップガイド

このドキュメントでは、diet-workアプリケーションの開発環境をセットアップする方法を詳しく説明します。

## 前提条件

以下のソフトウェアがインストールされている必要があります:

- **Node.js** 20.9.0以上（推奨: 20.x LTS）
- **npm** または **yarn**
- **Docker** と **Docker Compose**（ローカルデータベースを使用する場合）
- **Git**

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd diet-work
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`ファイルをコピーして`.env`ファイルを作成します:

```bash
cp .env.example .env
```

`.env`ファイルを編集して、以下の環境変数を設定します:

```env
# データベース接続文字列（デフォルトでOK）
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diet_work?schema=public"

# 認証シークレット（openssl rand -base64 32で生成）
AUTH_SECRET="your-generated-secret-key"

# Google OAuth認証情報（Google Cloud Consoleから取得）
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# ローカル開発URL（デフォルトでOK）
AUTH_URL="http://localhost:3000"
```

#### AUTH_SECRETの生成

```bash
openssl rand -base64 32
```

このコマンドで生成された文字列を`AUTH_SECRET`に設定します。

#### Google OAuth認証情報の取得

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth クライアント ID」を選択
5. アプリケーションの種類で「ウェブアプリケーション」を選択
6. 承認済みのリダイレクトURIに以下を追加:
   - `http://localhost:3000/api/auth/callback/google`
7. クライアントIDとクライアントシークレットをコピーして`.env`に設定

### 4. データベースのセットアップ

#### オプション A: 自動セットアップスクリプトを使用（推奨）

```bash
./setup-db.sh
```

このスクリプトは以下を自動的に実行します:
- PostgreSQLコンテナの起動
- Prisma Clientの生成
- データベースマイグレーションの実行

#### オプション B: 手動セットアップ

1. PostgreSQLコンテナを起動:

```bash
docker-compose up -d
```

2. データベースの準備ができるまで待機（5秒程度）

3. Prisma Clientを生成:

```bash
npx prisma generate
```

4. データベースマイグレーションを実行:

```bash
npx prisma migrate dev --name init
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスします。

## トラブルシューティング

### エラー: Can't reach database server at `localhost`:`5432`

このエラーは、PostgreSQLデータベースに接続できないことを示しています。

**解決方法:**

1. `.env`ファイルが存在することを確認:
   ```bash
   ls -la .env
   ```
   存在しない場合は、`.env.example`からコピー:
   ```bash
   cp .env.example .env
   ```

2. PostgreSQLコンテナが起動していることを確認:
   ```bash
   docker ps | grep postgres
   ```
   起動していない場合は起動:
   ```bash
   docker-compose up -d
   ```

3. データベース接続文字列が正しいことを確認:
   ```bash
   cat .env | grep DATABASE_URL
   ```
   以下のようになっているはずです:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/diet_work?schema=public"
   ```

4. ポート5432が他のプロセスで使用されていないことを確認:
   ```bash
   lsof -i :5432
   ```

### エラー: Port 5432 is already in use

ポート5432が既に使用されている場合、以下のいずれかを実行します:

**オプション 1: 既存のPostgreSQLを停止**

```bash
# Dockerコンテナの場合
docker stop diet-work-postgres

# システムのPostgreSQLサービスの場合（macOS）
brew services stop postgresql

# システムのPostgreSQLサービスの場合（Linux）
sudo systemctl stop postgresql
```

**オプション 2: 別のポートを使用**

`docker-compose.yml`を編集して、ポート番号を変更します:

```yaml
ports:
  - "5433:5432"  # ホスト側を5433に変更
```

その後、`.env`の`DATABASE_URL`も更新します:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/diet_work?schema=public"
```

### マイグレーションエラー

マイグレーションに失敗した場合:

```bash
# データベースをリセット（データが失われます）
npx prisma migrate reset

# マイグレーションを再実行
npx prisma migrate dev
```

## 便利なコマンド

### データベース関連

```bash
# Prisma Studioを起動（データベースのGUI）
npx prisma studio

# Prisma Clientを再生成
npx prisma generate

# マイグレーションを作成
npx prisma migrate dev --name <migration-name>

# マイグレーションをデプロイ（本番環境）
npx prisma migrate deploy

# データベースをリセット
npx prisma migrate reset
```

### Docker関連

```bash
# コンテナを起動
docker-compose up -d

# コンテナを停止
docker-compose down

# コンテナのログを表示
docker-compose logs -f postgres

# コンテナ内でPostgreSQLに接続
docker exec -it diet-work-postgres psql -U postgres -d diet_work
```

### 開発サーバー

```bash
# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# 本番サーバーを起動
npm start

# Lintを実行
npm run lint
```

## 開発ワークフロー

### 新機能の開発

1. 新しいブランチを作成:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. コードを変更

3. 変更をテスト:
   ```bash
   npm run dev
   ```

4. Lintを実行:
   ```bash
   npm run lint
   ```

5. コミット:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

6. プッシュ:
   ```bash
   git push origin feature/your-feature-name
   ```

7. プルリクエストを作成

### データベーススキーマの変更

1. `prisma/schema.prisma`を編集

2. マイグレーションを作成:
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```

3. Prisma Clientが自動的に再生成されます

## よくある質問

### Q: Google OAuth認証なしで開発できますか？

A: 現在のアプリケーションはGoogle OAuth認証が必須です。開発には有効なGoogle OAuth認証情報が必要です。

### Q: 本番環境と開発環境で異なるデータベースを使用できますか？

A: はい。`.env`ファイル（開発環境）と、Vercelの環境変数（本番環境）で異なる`DATABASE_URL`を設定できます。

### Q: Docker以外でPostgreSQLをセットアップできますか？

A: はい。ローカルにPostgreSQLをインストールするか、Supabase、Neon、Vercel Postgresなどのクラウドサービスを使用できます。その場合、`.env`の`DATABASE_URL`を適切に設定してください。

## 追加リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
