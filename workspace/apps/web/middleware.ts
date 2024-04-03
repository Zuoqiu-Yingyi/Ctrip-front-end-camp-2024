// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
import { NextResponse } from 'next/server'
 
// export default NextAuth(authConfig).auth;
export function middleware() {
  return NextResponse.next();
}
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};