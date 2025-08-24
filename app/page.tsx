import { redirect } from "next/navigation";
import { fetchUserInfo } from "@/lib/auth";

export default async function Home() {
  const info = await fetchUserInfo();
  if (info.ok) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
