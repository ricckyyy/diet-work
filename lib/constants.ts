/**
 * 開発環境用のダミーユーザーID
 * 開発環境では認証をスキップし、このIDを使用して動作します
 */
export const DEV_USER_ID = "dev-user-123"

/**
 * 認証をスキップする環境かどうかを判定
 * ローカル開発環境（NODE_ENV=development）またはVercelプレビュー環境で認証をスキップ
 * @returns 認証をスキップする場合はtrue
 */
export function shouldSkipAuth(): boolean {
  // ローカル開発環境
  if (process.env.NODE_ENV === "development") {
    return true
  }
  
  // Vercelプレビュー環境
  if (process.env.VERCEL_ENV === "preview") {
    return true
  }
  
  return false
}
