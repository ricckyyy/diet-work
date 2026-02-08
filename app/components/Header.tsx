import { auth, signOut } from "@/auth"
import Image from "next/image"
import Link from "next/link"

export default async function Header() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
            ダイエット × 副業 連動アプリ
          </Link>
          
          <nav className="flex gap-4">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              ホーム
            </Link>
            <Link 
              href="/health-record" 
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              健康記録
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
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
            <span className="text-sm text-gray-700">{session.user.name}</span>
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
        </div>
      </div>
    </header>
  )
}
