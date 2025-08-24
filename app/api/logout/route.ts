import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));

  // Clear cookies
  res.cookies.set("access_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set("user_id", "", { path: "/", maxAge: 0 });
  res.cookies.set("user_name", "", { path: "/", maxAge: 0 });

  return res;
}
