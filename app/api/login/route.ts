import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }
  // Forward to backend token endpoint
  const tokenRes = await fetch(`${API_BASE}/v1/yeshtery/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, isEmployee: true }),
    cache: "no-store"
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return NextResponse.json({ message: "Invalid credentials", details: text }, { status: 401 });
  }
  const tokenJson = await tokenRes.json(); // { token: ..., refresh: ... }
  const accessToken = tokenJson.token;
  if (!accessToken) {
    return NextResponse.json({ message: "Token missing in response" }, { status: 500 });
  }

  // Fetch user info with received token
  const userRes = await fetch(`${API_BASE}/v1/user/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!userRes.ok) {
    // If user info fails, clear any cookies and send back to login
    const resp = NextResponse.json({ message: "Failed to get user info" }, { status: 401 });
    resp.cookies.set("access_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
    resp.cookies.set("user_id", "", { path: "/", maxAge: 0 });
    resp.cookies.set("user_name", "", { path: "/", maxAge: 0 });
    return resp;
  }
  const user = await userRes.json(); // expects { id, name, ... }

  // Set cookies
  const resp = NextResponse.json({ user: { id: String(user.id), name: String(user.name) } }, { status: 200 });
  // HttpOnly token cookie
  resp.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    // If backend includes exp we could parse it; otherwise set 1 hour default
    maxAge: 60 * 60
  });
  // Optional readable cookies
  resp.cookies.set("user_id", String(user.id), { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 });
  resp.cookies.set("user_name", String(user.name), { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 });

  return resp;
}
