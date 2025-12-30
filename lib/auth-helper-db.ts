import { prisma } from "@/lib/prisma"

/**
 * メールアドレスからユーザーIDを取得または作成する
 * サーバーサイドのみで使用可能
 */
export async function getUserIdByEmail(email: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user) {
    return user.id
  }

  // ユーザーが存在しない場合は作成
  const newUser = await prisma.user.create({
    data: {
      email,
    },
  })

  return newUser.id
}
