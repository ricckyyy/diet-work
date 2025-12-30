#!/bin/bash

# データベースセットアップスクリプト
# PostgreSQLコンテナを起動し、Prismaのマイグレーションを実行します
#
# 使用方法:
#   chmod +x setup-db.sh  # 初回のみ実行権限を付与
#   ./setup-db.sh         # セットアップを実行

set -e

echo "🚀 diet-work データベースセットアップを開始します..."

# .envファイルの確認
if [ ! -f .env ]; then
    echo "⚠️  .envファイルが見つかりません"
    echo "📝 .env.exampleから.envファイルを作成しています..."
    cp .env.example .env
    echo "✅ .envファイルを作成しました"
    echo ""
    echo "⚠️  重要: .envファイルを編集して以下の情報を設定してください:"
    echo "   - AUTH_SECRET (openssl rand -base64 32 で生成)"
    echo "   - AUTH_GOOGLE_ID (Google Cloud Consoleから取得)"
    echo "   - AUTH_GOOGLE_SECRET (Google Cloud Consoleから取得)"
    echo ""
fi

# Dockerの確認
if ! command -v docker &> /dev/null; then
    echo "❌ Dockerがインストールされていません"
    echo "   https://docs.docker.com/get-docker/ からDockerをインストールしてください"
    exit 1
fi

# Docker Composeの確認
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Composeがインストールされていません"
    exit 1
fi

# PostgreSQLコンテナの起動
echo "🐘 PostgreSQLコンテナを起動しています..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

# データベースの準備ができるまで待機
echo "⏳ データベースの準備を待っています..."
for i in {1..30}; do
    if docker exec diet-work-postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ データベースの準備が完了しました"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ データベースの準備がタイムアウトしました"
        exit 1
    fi
    sleep 1
done

# Prisma Clientの生成
echo "🔧 Prisma Clientを生成しています..."
npx prisma generate

# マイグレーションの実行
echo "📊 データベースマイグレーションを実行しています..."
# 既存のマイグレーションがあれば適用、なければスキップ
npx prisma migrate deploy || npx prisma migrate dev

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "次のコマンドで開発サーバーを起動できます:"
echo "  npm run dev"
echo ""
echo "Prisma Studioでデータベースを確認するには:"
echo "  npx prisma studio"
echo ""
