export const SMS_OTP_TTL_SECONDS = 180;
export const SMS_RESEND_COOLDOWN_SECONDS = 30;

const REGISTERED_MASKED_PHONES: Record<string, string> = {
  "admin.hq@aicte-india.org": "+91 ••••••1104",
  "bureau.approval@aicte-india.org": "+91 ••••••2389",
  "ro.west@aicte-india.org": "+91 ••••••3910",
  "scrutiny.west01@aicte-india.org": "+91 ••••••4721",
  "evc.coord.west@aicte-india.org": "+91 ••••••5608",
  "principal@vjti.ac.in": "+91 ••••••8101",
  "auditor.external@cag.gov.in": "+91 ••••••7450",
};

export function getRegisteredMaskedPhone(
  identifier: string,
  loginMode: "COUNCIL" | "INSTITUTION"
): string {
  const normalized = identifier.trim().toLowerCase();
  if (REGISTERED_MASKED_PHONES[normalized]) {
    return REGISTERED_MASKED_PHONES[normalized];
  }
  return loginMode === "INSTITUTION" ? "+91 ••••••8101" : "+91 ••••••6240";
}

export function generateTemporaryOtp(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return String(code);
}

export function validateSmsOtpFormat(code: string): { valid: boolean; error?: string } {
  const cleaned = code.trim();
  if (!cleaned) {
    return { valid: false, error: "Please enter the 6-digit temporary SMS verification code." };
  }
  if (!/^\d{6}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Temporary SMS 2FA code must contain exactly 6 numeric digits.",
    };
  }
  return { valid: true };
}

export function verifySmsOtpChallenge(
  inputCode: string,
  expectedCode: string,
  expiresAtMs: number,
  nowMs: number = Date.now()
): { verified: boolean; reason?: string } {
  const formatCheck = validateSmsOtpFormat(inputCode);
  if (!formatCheck.valid) {
    return { verified: false, reason: formatCheck.error };
  }
  if (nowMs > expiresAtMs) {
    return {
      verified: false,
      reason: "Temporary SMS 2FA code has expired. Please request a fresh verification code.",
    };
  }
  if (inputCode.trim() !== expectedCode.trim()) {
    return {
      verified: false,
      reason: "Incorrect temporary SMS verification code. Please verify and try again.",
    };
  }
  return { verified: true };
}

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
