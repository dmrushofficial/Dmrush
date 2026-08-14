/**
 * Local-development file storage abstraction.
 *
 * Files are stored under `data/uploads/` (outside `public/`) and served only
 * through authenticated `/api/files/[id]` routes. Replace the body of this
 * module with S3/R2 later without changing UI callers.
 *
 * Limitation: single-server local disk only — not suitable for multi-instance
 * production without swapping this adapter.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { readLmsDb, writeLmsDb, newId } from "./lms-db";
import type { PortalFileMeta } from "./types";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
]);

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export function allowedUploadMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

export function maxUploadBytes(): number {
  return MAX_BYTES;
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function diskPath(fileId: string): string {
  // Never use original filename on disk
  return path.join(UPLOAD_DIR, `${fileId}.bin`);
}

export function getFileMeta(id: string): PortalFileMeta | undefined {
  return readLmsDb().files?.find((f) => f.id === id);
}

export async function saveUpload(input: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  ownerId: string;
  ownerRole: "student" | "teacher";
  purpose: "submission" | "resource";
  courseId?: string;
  assignmentId?: string;
}): Promise<PortalFileMeta> {
  if (!allowedUploadMime(input.mimeType)) {
    throw new Error("File type not allowed.");
  }
  if (input.buffer.length <= 0 || input.buffer.length > MAX_BYTES) {
    throw new Error(`File must be between 1 byte and ${MAX_BYTES / (1024 * 1024)} MB.`);
  }

  ensureUploadDir();
  const id = newId("FILE");
  const safeOriginal = path.basename(input.originalName).slice(0, 180) || "upload.bin";
  fs.writeFileSync(diskPath(id), input.buffer);

  const meta: PortalFileMeta = {
    id,
    originalName: safeOriginal,
    mimeType: input.mimeType,
    size: input.buffer.length,
    ownerId: input.ownerId,
    ownerRole: input.ownerRole,
    purpose: input.purpose,
    courseId: input.courseId,
    assignmentId: input.assignmentId,
    createdAt: new Date().toISOString(),
    checksum: crypto.createHash("sha256").update(input.buffer).digest("hex").slice(0, 16),
  };

  const db = readLmsDb();
  db.files = db.files || [];
  db.files.unshift(meta);
  writeLmsDb(db);
  return meta;
}

export function readUploadBuffer(fileId: string): Buffer | null {
  const p = diskPath(fileId);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p);
}

export function deleteUpload(fileId: string): void {
  const p = diskPath(fileId);
  if (fs.existsSync(p)) fs.unlinkSync(p);
  const db = readLmsDb();
  db.files = (db.files || []).filter((f) => f.id !== fileId);
  writeLmsDb(db);
}
