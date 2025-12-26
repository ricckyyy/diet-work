import { auth } from "@/auth"
import { NextResponse } from "next/server"

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
