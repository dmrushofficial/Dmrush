import fs from "fs";
import path from "path";
import type { InquiriesDatabase, PortalInquiry } from "./types";
import { newId } from "./lms-db";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "portal-inquiries.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ inquiries: [] }, null, 2), "utf-8");
  }
}

export function readInquiriesDb(): InquiriesDatabase {
  ensure();
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as InquiriesDatabase;
}

export function writeInquiriesDb(db: InquiriesDatabase) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function createInquiry(input: Omit<PortalInquiry, "id" | "status" | "createdAt">): PortalInquiry {
  const db = readInquiriesDb();
  const item: PortalInquiry = {
    id: newId("INQ"),
    name: input.name,
    email: input.email,
    phone: input.phone,
    interestedCourse: input.interestedCourse,
    message: input.message,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.inquiries.unshift(item);
  writeInquiriesDb(db);
  return item;
}
