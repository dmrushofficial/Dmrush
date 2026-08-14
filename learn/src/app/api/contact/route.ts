import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/portal/inquiries";
import { courses } from "@/content/courses";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const interestedCourse =
    typeof body.interestedCourse === "string" ? body.interestedCourse.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length < 2) {
    return NextResponse.json({ success: false, message: "Name is required." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ success: false, message: "Valid email is required." }, { status: 400 });
  }
  if (!interestedCourse) {
    return NextResponse.json({ success: false, message: "Select a course." }, { status: 400 });
  }
  const known = courses.some((c) => c.slug === interestedCourse || c.id === interestedCourse);
  if (!known) {
    return NextResponse.json({ success: false, message: "Unknown course selection." }, { status: 400 });
  }

  try {
    const inquiry = createInquiry({
      name,
      email,
      phone,
      interestedCourse,
      message,
    });
    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: "Thanks — your inquiry was received. We will contact you soon.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not save inquiry. Please try again." },
      { status: 500 },
    );
  }
}
