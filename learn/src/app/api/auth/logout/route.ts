import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE } from "@/lib/portal/auth";

export async function POST() {
  const cookieStore = await cookies();
  destroySession(cookieStore.get(SESSION_COOKIE)?.value);
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.LEARN_COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
