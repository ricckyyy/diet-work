import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    console.log("[Middleware] Request:", {
      url: request.url,
      pathname: request.nextUrl.pathname,
      method: request.method,
      headers: {
        host: request.headers.get("host"),
        origin: request.headers.get("origin"),
      }
    })

    const session = await auth()
    
    console.log("[Middleware] Session:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
    })

    // 認証が必要なパスで、セッションがない場合はログインページにリダイレクト
    if (!session && !request.nextUrl.pathname.startsWith("/auth/signin")) {
      console.log("[Middleware] Redirecting to signin")
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // ログイン済みユーザーがログインページにアクセスした場合はホームにリダイレクト
    if (session && request.nextUrl.pathname.startsWith("/auth/signin")) {
      console.log("[Middleware] Redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("[Middleware] Error:", error)
    // エラーが発生しても、とりあえずリクエストを通す
    return NextResponse.next()
  }
}

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
