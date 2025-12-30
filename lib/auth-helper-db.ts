import { prisma } from "@/lib/prisma"

/**
 * メールアドレスからユーザーIDを取得または作成する
 * サーバーサイドのみで使用可能
 * 
 * OAuth認証されたユーザーのみがこの関数を呼び出すため、
 * ユーザーが存在しない場合は自動的に作成します。
 * 
 * @param email - ユーザーのメールアドレス（OAuth認証で取得）
 * @returns データベース内のユーザーID
 * @throws {Error} emailが無効な場合
 */
export async function getUserIdByEmail(email: string): Promise<string> {
	// メールアドレスのバリデーション
	if (!email || typeof email !== 'string' || email.trim().length === 0) {
		throw new Error('有効なメールアドレスが必要です')
	}

	const normalizedEmail = email.trim().toLowerCase()

	const user = await prisma.user.findUnique({
		where: { email: normalizedEmail },
	})

	if (user) {
		return user.id
	}

	// ユーザーが存在しない場合は作成
	// OAuth認証を通過したユーザーのみがここに到達するため安全
	const newUser = await prisma.user.create({
		data: {
			email: normalizedEmail,
		},
	})

	return newUser.id
}
