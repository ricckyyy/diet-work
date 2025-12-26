import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

  // 認証されていない場合、ログインページにリダイレクト
  if (!isLoggedIn && !isAuthPage) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // 既にログイン済みでログインページにアクセスした場合、ホームにリダイレクト
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * 以下のパスを除外:
     * - /api/auth (認証API)
     * - /_next/static (静的ファイル)
     * - /_next/image (画像最適化)
     * - /favicon.ico, /sitemap.xml, /robots.txt (メタデータファイル)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
