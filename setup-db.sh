#!/bin/bash

# データベースセットアップスクリプト
# PostgreSQLコンテナを起動し、Prismaのマイグレーションを実行します

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
sleep 5

# Prisma Clientの生成
echo "🔧 Prisma Clientを生成しています..."
npx prisma generate

# マイグレーションの実行
echo "📊 データベースマイグレーションを実行しています..."
npx prisma migrate dev --name init

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "次のコマンドで開発サーバーを起動できます:"
echo "  npm run dev"
echo ""
echo "Prisma Studioでデータベースを確認するには:"
echo "  npx prisma studio"
echo ""
