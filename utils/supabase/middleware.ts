import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/public',
  '/auth/callback'
];

export const updateSession = async (request: NextRequest) => {
  try {
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => {
      // Exact match for root path
      if (request.nextUrl.pathname === '/') {
        return true;
      }
      // For other routes, check if it starts with the route and is followed by / or end of string
      return request.nextUrl.pathname.match(new RegExp(`^${route}(?:/|$)`));
    });

    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // Allow access to public routes regardless of auth status
    if (isPublicRoute) {
      return response;
    }

    // Protect non-public routes
    if (user.error) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
