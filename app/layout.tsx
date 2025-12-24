import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ダイエット × 副業 連動アプリ",
  description: "体重と副業を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
