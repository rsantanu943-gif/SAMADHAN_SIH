import { getApprovedUser } from "@/lib/auth/server";

export async function GET() {
  const user = await getApprovedUser();
  return Response.json(user ? { email: user.email } : { error: "Sign in with an approved, verified account." }, {
    status: user ? 200 : 401,
    headers: { "Cache-Control": "private, no-store" },
  });
}
