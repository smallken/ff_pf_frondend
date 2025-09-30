import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'System Upgrade - Flipflop Footprint',
  description: 'Flipflop Footprint system is currently undergoing maintenance',
};

// 强制此布局不继承RootLayout
export const dynamic = 'force-static';
export const revalidate = false;
export const preferredRegion = 'global';
export const runtime = 'nodejs';

// 显式指定这是根布局，而不是嵌套布局
export default function MaintenanceRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" />
        {/* 防止缓存 */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
