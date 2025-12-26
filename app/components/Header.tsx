import { auth, signOut } from "@/auth"
import Image from "next/image"

export default async function Header() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">
          ダイエット × 副業 連動アプリ
        </h1>
        
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
