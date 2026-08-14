import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSafeStudentFromToken,
  getSafeTeacherFromToken,
  parseSession,
  SESSION_COOKIE,
} from "@/lib/portal/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = parseSession(token);
  if (!session) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }
  if (session.role === "teacher") {
    const user = getSafeTeacherFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }
    return NextResponse.json({ success: true, role: "teacher", user });
  }
  const user = getSafeStudentFromToken(token);
  if (!user) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }
  return NextResponse.json({ success: true, role: "student", user });
}
