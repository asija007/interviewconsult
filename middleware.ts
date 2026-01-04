import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn =
    request.cookies.get("firebase-auth")?.value === "true";

  const protectedRoutes = ["/dashboard", "/onboarding"];

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/intent/:path*", "/practice/:path*", "/company-select/:path*",   "/payment/:path*",],
};
