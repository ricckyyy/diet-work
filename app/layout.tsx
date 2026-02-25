import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import MuiThemeProvider from "./providers/MuiThemeProvider";

export const metadata: Metadata = {
  title: "ダイエット × 活動 連動アプリ",
  description: "体重と活動を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <MuiThemeProvider>
          <Header />
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
