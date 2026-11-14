import test from "node:test";
import assert from "node:assert/strict";
import {
  getRegisteredMaskedPhone,
  generateTemporaryOtp,
  validateSmsOtpFormat,
  verifySmsOtpChallenge,
  formatCountdown,
} from "./sms-2fa";

test("getRegisteredMaskedPhone returns deterministic masked numbers for known roles and fallback", () => {
  assert.equal(
    getRegisteredMaskedPhone("scrutiny.west01@aicte-india.org", "COUNCIL"),
    "+91 ••••••4721"
  );
  assert.equal(
    getRegisteredMaskedPhone("principal@vjti.ac.in", "INSTITUTION"),
    "+91 ••••••8101"
  );
  assert.equal(
    getRegisteredMaskedPhone("unknown.user@org.in", "COUNCIL"),
    "+91 ••••••6240"
  );
});

test("generateTemporaryOtp generates 6-digit numeric strings", () => {
  for (let i = 0; i < 10; i++) {
    const otp = generateTemporaryOtp();
    assert.match(otp, /^\d{6}$/);
  }
});

test("validateSmsOtpFormat rejects empty and non-6-digit codes", () => {
  assert.equal(validateSmsOtpFormat("").valid, false);
  assert.equal(validateSmsOtpFormat("12345").valid, false);
  assert.equal(validateSmsOtpFormat("12ab56").valid, false);
  assert.equal(validateSmsOtpFormat("482915").valid, true);
});

test("verifySmsOtpChallenge verifies matching non-expired OTP and rejects wrong or expired OTP", () => {
  const now = 1_700_000_000_000;
  const future = now + 60_000;
  const past = now - 1_000;

  assert.equal(verifySmsOtpChallenge("482915", "482915", future, now).verified, true);

  const wrong = verifySmsOtpChallenge("111111", "482915", future, now);
  assert.equal(wrong.verified, false);
  assert.match(wrong.reason || "", /Incorrect temporary SMS/i);

  const expired = verifySmsOtpChallenge("482915", "482915", past, now);
  assert.equal(expired.verified, false);
  assert.match(expired.reason || "", /expired/i);
});

test("formatCountdown formats seconds cleanly as MM:SS", () => {
  assert.equal(formatCountdown(180), "03:00");
  assert.equal(formatCountdown(65), "01:05");
  assert.equal(formatCountdown(-5), "00:00");
});
