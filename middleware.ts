import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { shouldSkipAuth } from "@/lib/constants"

// ローカル環境でのみアクセス可能なパス
const LOCAL_ONLY_PATHS = ["/test-meeting", "/test-meeting-resize"]

function isLocalOnlyPath(pathname: string): boolean {
  return LOCAL_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))
}

// NextAuth v5 推奨: auth() を高階関数として使用することで、
// ミドルウェアのリクエストコンテキストからセッションを正しく読み込む
export default auth(async (req) => {
  try {
    const request = req as NextRequest
    const pathname = req.nextUrl.pathname

    console.log("[Middleware] Request:", {
      url: req.url,
      pathname,
      method: req.method,
      headers: {
        host: req.headers.get("host"),
        origin: req.headers.get("origin"),
      }
    })

    // ローカル環境専用ページへのアクセス制限
    if (isLocalOnlyPath(pathname)) {
      if (process.env.NODE_ENV !== "development") {
        console.log("[Middleware] Blocking local-only path in non-development environment:", pathname)
        return new NextResponse(null, { status: 404 })
      }
    }

    // 開発環境では認証スキップ
    if (shouldSkipAuth()) {
      console.log("[Middleware] Auth skip mode - skipping authentication")
      return NextResponse.next()
    }

    // req.auth は NextAuth が自動的にリクエストのクッキーから読み込んだセッション
    const session = req.auth

    console.log("[Middleware] Session:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
    })

    // 認証が必要なパスで、セッションがない場合はログインページにリダイレクト
    if (!session && !pathname.startsWith("/auth/signin")) {
      console.log("[Middleware] Redirecting to signin")
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // ログイン済みユーザーがログインページにアクセスした場合はホームにリダイレクト
    if (session && pathname.startsWith("/auth/signin")) {
      console.log("[Middleware] Redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Error:", error)
    // エラーが発生しても、とりあえずリクエストを通す
    return NextResponse.next()
  }
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
