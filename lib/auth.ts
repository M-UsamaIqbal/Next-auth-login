import { cookies } from "next/headers";

export const API_BASE = "https://api-yeshtery.dev.meetusvr.com";

export async function fetchUserInfo(token?: string) {
  const t = token ?? (await cookies()).get("access_token")?.value;
  if (!t) return { ok: false, status: 401 as const };
  const res = await fetch(`${API_BASE}/v1/user/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${t}`
    },
    // No cache to avoid stale auth
    cache: "no-store"
  });
  if (!res.ok) return { ok: false, status: res.status as 401 | 403 | 500 };
  const data = await res.json();
  return { ok: true, data } as const;
}
