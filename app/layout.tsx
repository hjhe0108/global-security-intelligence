import type { Metadata } from "next";
import "@fontsource-variable/chiron-hei-hk/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vision Intelligence｜全球安防市場情報",
  description: "公司內部使用的全球安防市場情報與週報閱讀平台。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
