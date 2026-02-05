import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { DEV_USER_ID } from "./constants"

/**
 * 認証ユーザーを取得
 * 開発環境ではダミーユーザーを返し、本番環境では実際の認証セッションから取得
 */
export async function getAuthUser() {
  // 開発環境ではダミーユーザーを返す
  if (process.env.NODE_ENV === "development") {
    return {
      id: DEV_USER_ID,
      email: "dev@example.com",
      name: "開発ユーザー",
      image: null,
    }
  }

  // 本番環境では通常の認証
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  
  return {
    id: session.user.id,
    email: session.user.email || null,
    name: session.user.name || null,
    image: session.user.image || null,
  }
}

/**
 * 認証ユーザーIDを取得
 * 開発環境ではダミーユーザーID、本番環境では実際のユーザーID
 */
export async function getAuthUserId(): Promise<string> {
  const user = await getAuthUser()
  return user.id
}

/**
 * 認証チェックヘルパー関数
 * 現在のユーザーのセッションを取得し、認証されていない場合は401エラーを返す
 * @returns ユーザーIDまたは401エラーレスポンス
 */
export async function requireAuth(): Promise<
  { userId: string } | { error: NextResponse }
> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  return { userId: session.user.id }
}
