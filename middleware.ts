import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/categories',
  '/collections',
  '/sections(.*)',
  '/store(.*)',
  '/product(.*)',
  '/api/products',
  '/api/collections',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/checkout(.*)',
  '/api/user/orders(.*)',
  '/api/user/cart',
  '/api/user/wishlist'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Explicit protection check for admin routes
    const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);
    if (isAdminRoute(req)) {
      const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim());
      if (!adminIds.includes(userId)) {
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
