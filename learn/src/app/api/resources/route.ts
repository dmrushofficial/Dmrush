import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/portal/api-auth";
import {
  deleteCourseResource,
  listCourseResources,
  newId,
  upsertCourseResource,
} from "@/lib/portal/lms-db";
import { saveUpload } from "@/lib/portal/storage";

export async function GET(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const courseId = new URL(request.url).searchParams.get("courseId")?.trim() || "";
  if (!courseId || !auth.teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  return NextResponse.json({
    success: true,
    resources: listCourseResources(courseId),
  });
}

export async function POST(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const form = await request.formData();
  const courseId = String(form.get("courseId") || "").trim();
  const title = String(form.get("title") || "").trim() || "Course resource";
  const file = form.get("file");
  if (!courseId || !auth.teacher.assignedCourseIds.includes(courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  if (!file || typeof file === "string" || file.size <= 0) {
    return NextResponse.json({ success: false, message: "File required." }, { status: 400 });
  }
  try {
    const meta = await saveUpload({
      buffer: Buffer.from(await file.arrayBuffer()),
      originalName: file.name || "resource.bin",
      mimeType: file.type || "application/octet-stream",
      ownerId: auth.teacher.id,
      ownerRole: "teacher",
      purpose: "resource",
      courseId,
    });
    const resource = upsertCourseResource({
      id: newId("RES"),
      courseId,
      title,
      fileId: meta.id,
      uploadedByTeacherId: auth.teacher.id,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, resource });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireTeacher();
  if ("error" in auth) return auth.error;
  const id = new URL(request.url).searchParams.get("id")?.trim() || "";
  const resources = listCourseResources();
  const item = resources.find((r) => r.id === id);
  if (!item || !auth.teacher.assignedCourseIds.includes(item.courseId)) {
    return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
  }
  deleteCourseResource(id);
  return NextResponse.json({ success: true });
}
