import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateAverageScore,
  classifyComplianceStatus,
  filterAudits,
  calculateTrendSummary,
  SIX_MONTH_TREND_DATA,
  formatGeminiContents,
  extractGroundingSources,
  AuditRecord,
} from "./compliance";
import { FlowGuardStore } from "./flowguard-store";

const sampleAudits: AuditRecord[] = [
  { id: "AUD-001", entity: "Health Dept", type: "Financial", status: "Verified", date: "2024-10-15", score: 98 },
  { id: "AUD-002", entity: "Transport", type: "Security", status: "Flagged", date: "2024-10-18", score: 70 },
  { id: "AUD-003", entity: "Water Agency", type: "Environment", status: "Non-Compliant", date: "2024-10-20", score: 45 },
];

test("calculateAverageScore computes precise mean", () => {
  assert.equal(calculateAverageScore(sampleAudits), 71);
  assert.equal(calculateAverageScore([]), 0);
});

test("classifyComplianceStatus maps scores to institutional tiers", () => {
  assert.equal(classifyComplianceStatus(95), "Verified");
  assert.equal(classifyComplianceStatus(85), "Pending Review");
  assert.equal(classifyComplianceStatus(65), "Flagged");
  assert.equal(classifyComplianceStatus(40), "Non-Compliant");
});

test("filterAudits filters correctly by text query and status", () => {
  const verified = filterAudits(sampleAudits, "", "Verified");
  assert.equal(verified.length, 1);
  assert.equal(verified[0].id, "AUD-001");

  const searchTransport = filterAudits(sampleAudits, "transport", "All");
  assert.equal(searchTransport.length, 1);
  assert.equal(searchTransport[0].id, "AUD-002");

  const none = filterAudits(sampleAudits, "nonexistent", "All");
  assert.equal(none.length, 0);
});

test("calculateTrendSummary returns correct 6-month trajectory", () => {
  const summary = calculateTrendSummary(SIX_MONTH_TREND_DATA);
  assert.equal(summary.current, 88.4);
  assert.equal(summary.high, 89.1);
  assert.equal(summary.low, 82.5);
  assert.equal(summary.delta, 5.9);
  assert.equal(summary.isPositive, true);
});

test("formatGeminiContents properly maps assistant and user roles", () => {
  const input = [
    { role: "user", content: "What is NIST 800-53?" },
    { role: "assistant", content: "It is a security framework." },
    { role: "model", content: "Specific control AC-1 applies." },
  ];
  const formatted = formatGeminiContents(input);

  assert.equal(formatted.length, 3);
  assert.equal(formatted[0].role, "user");
  assert.equal(formatted[0].parts[0].text, "What is NIST 800-53?");
  assert.equal(formatted[1].role, "model");
  assert.equal(formatted[2].role, "model");
});

test("extractGroundingSources filters valid web citations", () => {
  const rawChunks = [
    { web: { uri: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final", title: "NIST SP 800-53 Rev. 5" } },
    { web: { uri: "https://www.fedramp.gov/baselines/", title: "FedRAMP Baselines" } },
    { other: {} },
    { web: null },
  ];

  const extracted = extractGroundingSources(rawChunks);
  assert.equal(extracted.length, 2);
  assert.equal(extracted[0].title, "NIST SP 800-53 Rev. 5");
  assert.equal(extracted[1].title, "FedRAMP Baselines");
});

test("FlowGuardStore retrieves synthetic applications and identifies overdue cases", () => {
  const apps = FlowGuardStore.getApplications();
  assert.ok(apps.length >= 5);

  const overdue = apps.filter(a => a.riskLevel === "Overdue");
  assert.ok(overdue.length >= 1);
  assert.equal(overdue[0].applicationNumber, "APP-2026-AICTE-088");
});

test("FlowGuardStore verifies documents and logs to audit trail", () => {
  const docs = FlowGuardStore.getDocuments();
  assert.ok(docs.length >= 5);

  const doc = docs[0];
  const updated = FlowGuardStore.verifyDocument(doc.id, "VERIFIED", "Statutory norm checked", "Auditor Test");
  assert.ok(updated);
  assert.equal(updated.verificationStatus, "VERIFIED");

  const logs = FlowGuardStore.getAuditLogs();
  assert.ok(logs.some(l => l.targetId === doc.id && l.action === "DOCUMENT_VERIFIED"));
});

test("FlowGuardStore generates role-grounded Next Best Actions", () => {
  const actions = FlowGuardStore.getNextBestActions("SCRUTINY_OFFICER");
  assert.ok(actions.length > 0);
  assert.ok(actions.some(a => a.isActionableByCurrentRole));
});
