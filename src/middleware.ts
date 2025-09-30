import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 检查是否在维护模式
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true'
  
  // 如果不在维护模式，正常访问
  if (!isMaintenance) {
    return NextResponse.next()
  }
  
  // 如果访问的是维护页面，允许访问
  if (request.nextUrl.pathname.startsWith('/maintenance')) {
    return NextResponse.next()
  }
  
  // 其他所有页面都重定向到维护页面
  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
