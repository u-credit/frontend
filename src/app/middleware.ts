// import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   const isAuthenticated = Boolean(req.cookies.get('refresh_token'));
//   console.log('isAuthenticated', isAuthenticated);
//   if (isAuthenticated && req.nextUrl.pathname === '/auth') {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/auth'],
// };
