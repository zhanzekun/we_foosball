import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 不需要登录的路径
  const publicPaths = ['/', '/api/auth']
  
  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 检查是否有 session cookie
  const sessionToken = request.cookies.get('next-auth.session-token') || 
                      request.cookies.get('__Secure-next-auth.session-token')

  // 如果没有 session token，重定向到登录页
  if (!sessionToken) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 有 session token，继续访问
  return NextResponse.next()
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api/auth (NextAuth 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
} 