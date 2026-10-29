// Keep this policy on the server; changes require a deployment.
export function isApprovedEmail(email?: string | null): boolean {
  return ["rsantanurana943@gmail.com", "sharmahimanshuprince@gmail.com"].includes(email?.trim().toLowerCase() ?? "");
}
