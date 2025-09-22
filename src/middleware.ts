
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const { pathname } = request.nextUrl

  const publicPaths = ['/', '/login', '/new-login', '/pricing', '/terms', '/privacy', '/hiring', '/auth/action'];
  const isPublicPath = publicPaths.some(p => pathname.startsWith(p));

  // If the user is authenticated and on a public path (like /login or /), redirect to /home
  if (currentUser && isPublicPath && pathname !== '/home') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If the user is unauthenticated and tries to access a protected route, redirect to login
  if (!currentUser && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
