import { NextRequest } from "next/server";
import { handleAdminApi } from "@/lib/admin/handle-api";

export const runtime = "nodejs";
export const maxDuration = 30;

async function run(req: NextRequest) {
  return handleAdminApi(req);
}

export const GET = run;
export const POST = run;
export const PUT = run;
export const DELETE = run;
export const PATCH = run;
