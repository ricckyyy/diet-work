import { signIn } from "@/auth"

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Googleログインの開始に失敗しました。もう一度お試しください。",
  OAuthCallback: "Googleからのコールバック処理に失敗しました。もう一度お試しください。",
  OAuthCreateAccount: "アカウントの作成に失敗しました。しばらく時間をおいてからお試しください。",
  OAuthAccountNotLinked:
    "このメールアドレスは既に別のログイン方法で登録されています。",
  Callback: "ログイン処理中にエラーが発生しました。もう一度お試しください。",
  Default: "ログインに失敗しました。もう一度お試しください。",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const params = await searchParams
  const showTestLogin = !!process.env.TEST_USER_EMAIL

  // callbackUrl を相対パスに限定してオープンリダイレクトを防止
  const rawCallbackUrl = params.callbackUrl ?? "/"
  const callbackUrl = rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/"

  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES.Default)
    : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ダイエット × 活動 連動アプリ
          </h1>
          <p className="text-gray-600">
            ログインして体重管理と活動記録を始めましょう
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          <form
            action={async () => {
              "use server"
              await signIn("google", {
                redirectTo: callbackUrl,
              })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleでログイン
            </button>
          </form>

          {showTestLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-400">または</span>
                </div>
              </div>

              <form
                action={async (formData: FormData) => {
                  "use server"
                  await signIn("credentials", {
                    email: formData.get("email"),
                    password: formData.get("password"),
                    redirectTo: callbackUrl,
                  })
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="メールアドレス"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="パスワード"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all"
                >
                  テストアカウントでログイン
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            ログインすることで、
            <a href="#" className="text-blue-600 hover:underline">
              利用規約
            </a>
            と
            <a href="#" className="text-blue-600 hover:underline">
              プライバシーポリシー
            </a>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  )
}
