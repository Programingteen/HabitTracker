import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get("next");

  const code = requestUrl.searchParams.get("code");

  /*
   * No authorization code means the confirmation callback
   * cannot establish a session.
   */
  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=missing_code",
        requestUrl.origin
      )
    );
  }

  const supabase = await createClient();

  /*
   * Exchange the PKCE authorization code for a session.
   *
   * This is the critical step that turns the email
   * confirmation into an authenticated browser session.
   */
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error(
      "Failed to exchange auth code:",
      exchangeError
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=auth_failed",
        requestUrl.origin
      )
    );
  }

  if (next === "/reset-password") {
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  /*
   * Now that the session exists, determine which part
   * of the application the user belongs in.
   */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(
      "Failed to retrieve authenticated user:",
      userError
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=session_failed",
        requestUrl.origin
      )
    );
  }

  /*
   * Check onboarding state.
   */
  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      "Failed to load profile:",
      profileError
    );

    /*
     * We know the user is authenticated, but cannot
     * determine onboarding state. Sending them to
     * onboarding is the safer fallback.
     */
    return NextResponse.redirect(
      new URL("/onboarding", requestUrl.origin)
    );
  }

  if (!profile || !profile.onboarding_completed) {
    return NextResponse.redirect(
      new URL("/onboarding", requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/dashboard", requestUrl.origin)
  );
}
