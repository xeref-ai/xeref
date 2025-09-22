
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const { pathname } = request.nextUrl

  // Allow access to the root page for unauthenticated users
  if (!currentUser && pathname === '/') {
    return NextResponse.next();
  }

  // If the user is authenticated and on the root path, redirect to /home
  if (currentUser && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If the user is unauthenticated and tries to access a protected route, redirect to /
  if (!currentUser && pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
