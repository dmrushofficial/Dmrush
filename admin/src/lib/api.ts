/** API base under the /admin mount. Vite BASE_URL is "/admin/". */
export function apiUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/admin/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}api${normalized}`.replace(/([^:]\/)\/+/g, "$1");
}

/** Authenticated admin API fetch — always sends session cookies. */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers,
  });
}
