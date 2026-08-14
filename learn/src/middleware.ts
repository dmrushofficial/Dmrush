import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/portal/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth =
    pathname.startsWith("/student") || pathname.startsWith("/teacher");

  if (!needsAuth) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*"],
};
