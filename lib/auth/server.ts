import "server-only";
import { cookies } from "next/headers";
import { isApprovedEmail } from "./approved-emails";

// Verify with Identity rather than trusting a decoded cookie or client state.
export async function getApprovedUser() {
  const token = (await cookies()).get("nf_jwt")?.value;
  if (!token) return null;
  try {
    const response = await fetch("https://samadhansi.netlify.app/.netlify/identity/user", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const user = await response.json();
    if (!user.id || !user.confirmed_at || !isApprovedEmail(user.email)) return null;
    return { id: user.id as string, email: user.email as string };
  } catch {
    return null;
  }
}
