import { redirect } from "next/navigation";
import { getApprovedUser } from "@/lib/auth/server";
import { SessionGuard } from "@/components/auth/SessionGuard";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await getApprovedUser())) redirect("/login");
  return <SessionGuard>{children}</SessionGuard>;
}
