import { redirect } from "next/navigation";

/** Retired course — keep URL from breaking. */
export default function SaaSAiToolsRedirectPage() {
  redirect("/courses");
}
