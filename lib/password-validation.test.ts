import test from "node:test";
import assert from "node:assert/strict";
import { validateLoginPassword, evaluatePasswordStrength } from "./password-validation";

test("validateLoginPassword returns empty state guidance for empty input", () => {
  const res = validateLoginPassword("");
  assert.equal(res.isValid, false);
  assert.equal(res.strength, "empty");
  assert.equal(res.strengthMetrics.score, 0);
  assert.equal(res.strengthMetrics.entropyBits, 0);
  assert.equal(res.metCount, 0);
  assert.match(res.helperText, /at least 8 characters/i);
});

test("validateLoginPassword flags passwords shorter than 8 characters", () => {
  const res = validateLoginPassword("Ab@1");
  assert.equal(res.isValid, false);
  assert.equal(res.strengthMetrics.tier, "weak");
  assert.equal(res.checks.find((c) => c.id === "minLength")?.met, false);
  assert.match(res.helperText, /4 more characters/i);
});

test("validateLoginPassword flags missing number and special character", () => {
  const res = validateLoginPassword("samadhan");
  assert.equal(res.isValid, false);
  assert.equal(res.checks.find((c) => c.id === "minLength")?.met, true);
  assert.equal(res.checks.find((c) => c.id === "hasLetter")?.met, true);
  assert.equal(res.checks.find((c) => c.id === "hasNumber")?.met, false);
  assert.equal(res.checks.find((c) => c.id === "hasSpecial")?.met, false);
  assert.match(res.helperText, /number/i);
  assert.match(res.helperText, /special character/i);
});

test("validateLoginPassword flags missing special character when letters and numbers exist", () => {
  const res = validateLoginPassword("samadhan2026");
  assert.equal(res.isValid, false);
  assert.match(res.helperText, /special character/i);
});

test("validateLoginPassword rejects whitespace", () => {
  const res = validateLoginPassword("samadhan @2026");
  assert.equal(res.isValid, false);
  assert.equal(res.strengthMetrics.tier, "weak");
  assert.match(res.helperText, /cannot contain spaces/i);
});

test("validateLoginPassword accepts valid statutory passwords including demo credential", () => {
  const demo = validateLoginPassword("samadhan@2026");
  assert.equal(demo.isValid, true);
  assert.ok(demo.strength === "good" || demo.strength === "strong");
  assert.ok(demo.strengthMetrics.entropyBits >= 50);
  assert.equal(demo.metCount, 4);
  assert.match(demo.helperText, /meets all minimum length/i);

  const highEntropy = validateLoginPassword("Portal#991!Vx");
  assert.equal(highEntropy.isValid, true);
  assert.equal(highEntropy.strength, "strong");
  assert.equal(highEntropy.strengthMetrics.score, 4);
  assert.equal(highEntropy.strengthMetrics.charClasses, 4);
});

test("evaluatePasswordStrength detects common patterns, sequences, and repeated chars", () => {
  const dict = evaluatePasswordStrength("password@1234");
  assert.ok(dict.detectedPatterns.some((p) => p.includes("Common word")));
  assert.ok(dict.score <= 2);

  const keyboard = evaluatePasswordStrength("qwerty!99");
  assert.ok(keyboard.detectedPatterns.some((p) => p.includes("Keyboard pattern")));
  assert.ok(keyboard.score <= 2);

  const repeated = evaluatePasswordStrength("aaaa1111@@@@");
  assert.ok(repeated.detectedPatterns.some((p) => p.includes("Repeated characters")));

  const sequential = evaluatePasswordStrength("abcd1234@");
  assert.ok(sequential.detectedPatterns.some((p) => p.includes("Sequential run")));
});
