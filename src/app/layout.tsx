import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import DynamicLangHtml from "./components/DynamicLangHtml";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ModuleProvider } from "../contexts/ModuleContext";
import ConditionalLayout from "./components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flipflop Footprint",
  description: "Flipflop Footprint - 寻路者计划",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 全局错误处理，避免Talisman扩展错误影响用户体验
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('Talisman extension')) {
                  event.preventDefault();
                  console.warn('Talisman extension error suppressed:', event.message);
                  return false;
                }
              });
              
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.message && event.reason.message.includes('Talisman extension')) {
                  event.preventDefault();
                  console.warn('Talisman extension promise rejection suppressed:', event.reason.message);
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
