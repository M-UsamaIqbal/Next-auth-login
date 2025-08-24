import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchUserInfo } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Hard check with backend to ensure token is valid (handles expiration)
  const info = await fetchUserInfo();
  if (!info.ok) {
    // Clear cookies (client will redirect by middleware on next request)
    redirect("/login");
  }
  const { id, name } = info.data as any;

  return (
    <div className="card">
      <h1 className="title">Dashboard</h1>
      <div className="row"><strong>ID:</strong><span>{String(id)}</span></div>
      <div className="row"><strong>Name:</strong><span>{String(name)}</span></div>
      <div className="spacer" />
      <form action="/api/logout" method="POST">
        <button className="btn logout" type="submit">Logout</button>
      </form>
    </div>
  );
}
