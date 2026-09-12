import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          response = NextResponse.next({
            request,
          });

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  /*
   * Refresh / verify the Supabase session.
   *
   * Supabase recommends getClaims() for server-side
   * authentication checks.
   */
  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const isAuthenticated =
    !claimsError && !!claimsData?.claims;

  const pathname = request.nextUrl.pathname;

  const isAuthCallback =
    pathname === "/auth/confirm";

  const isOnboarding =
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/");

  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  /*
   * Auth callback must be allowed through.
   * It is responsible for exchanging the PKCE code.
   */
  if (isAuthCallback) {
    return response;
  }

  /*
   * -------------------------------------------------------
   * LOGGED OUT
   * -------------------------------------------------------
   */

  if (!isAuthenticated) {
    /*
     * Private application routes require authentication.
     */
    if (isOnboarding || isDashboard) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    /*
     * Public routes remain accessible.
     */
    return response;
  }

  /*
   * -------------------------------------------------------
   * LOGGED IN
   * -------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We intentionally do not query the profiles table here.
   * The Proxy's responsibility is session handling and
   * basic route protection.
   *
   * Onboarding state is determined by the page/callback
   * that actually needs it.
   */

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};