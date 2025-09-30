import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 检查是否在维护模式
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true'
  
  // 如果不在维护模式，正常访问
  if (!isMaintenance) {
    return NextResponse.next()
  }
  
  // 如果当前就是访问维护页面，允许访问
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next()
  }
  
  // 如果是静态资源请求，允许通过
  if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico)$/)) {
    return NextResponse.next()
  }
  
  // 其他所有页面都重定向到维护页面
  return NextResponse.rewrite(new URL('/maintenance', request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
