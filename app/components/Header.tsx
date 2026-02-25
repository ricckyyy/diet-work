import { auth, signOut } from "@/auth"
import Image from "next/image"
import Link from "next/link"
import { shouldSkipAuth } from "@/lib/constants"

export default async function Header() {
  const session = await auth()
  const skipAuth = shouldSkipAuth()

  if (!session?.user && !skipAuth) return null

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-gray-800 hover:text-gray-600 transition-colors">
            ダイエット × 活動 連動アプリ
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              ホーム
            </Link>
            <Link
              href="/health-record"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              健康記録
            </Link>
            {process.env.NODE_ENV === "development" && (
              <>
                <Link
                  href="/test-meeting"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  会議室
                </Link>
                <Link
                  href="/test-meeting-resize"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  会議室(リサイズ)
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile nav */}
          <nav className="flex sm:hidden items-center gap-3">
            <Link
              href="/"
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              ホーム
            </Link>
            <Link
              href="/health-record"
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              健康記録
            </Link>
            {process.env.NODE_ENV === "development" && (
              <>
                <Link
                  href="/test-meeting"
                  className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
                >
                  会議室
                </Link>
                <Link
                  href="/test-meeting-resize"
                  className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
                >
                  リサイズ版
                </Link>
              </>
            )}
          </nav>

          {session?.user && (
            <>
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700 hidden sm:inline">{session.user.name}</span>
              </div>

              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
