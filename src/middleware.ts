import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/api")) {
    return NextResponse.next();
  }

  const last = pathname.split("/").pop() || "";
  if (last.includes(".") && !last.endsWith(".html")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/index.html";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
