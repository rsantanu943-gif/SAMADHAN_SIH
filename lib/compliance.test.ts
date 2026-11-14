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
  getAuditRecordById,
  findDuplicateHashMatches,
  AuditRecord,
} from "./compliance";
import { FlowGuardStore } from "./flowguard-store";

const sampleAudits: AuditRecord[] = [
  { id: "AUD-001", entity: "Health Dept", type: "Financial", status: "Verified", date: "2024-10-15", score: 98, summary: "Verified financial disbursements." },
  { id: "AUD-002", entity: "Transport", type: "Security", status: "Flagged", date: "2024-10-18", score: 70, summary: "Flagged gateway access controls." },
  { id: "AUD-003", entity: "Water Agency", type: "Environment", status: "Non-Compliant", date: "2024-10-20", score: 45, summary: "Expired environmental discharge clearance." },
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

test("getAuditRecordById retrieves distinct audit records case-insensitively", () => {
  const rec1 = getAuditRecordById("AUD-2024-001");
  assert.ok(rec1);
  assert.equal(rec1.entity, "Public Health Dept");
  assert.equal(rec1.score, 98);

  const rec5 = getAuditRecordById("aud-2024-005");
  assert.ok(rec5);
  assert.equal(rec5.status, "Non-Compliant");
  assert.equal(getAuditRecordById("AUD-9999-999"), undefined);
});

test("findDuplicateHashMatches detects cross-document SHA-256 collisions", () => {
  const docs = FlowGuardStore.getDocuments();
  const doc002 = docs.find((d) => d.id === "doc-002");
  const doc001 = docs.find((d) => d.id === "doc-001");
  assert.ok(doc002);
  assert.ok(doc001);

  const matchesFor002 = findDuplicateHashMatches(doc002, docs);
  assert.ok(matchesFor002.some((m) => m.id === "doc-005"));
  assert.equal(findDuplicateHashMatches(doc001, docs).length, 0);
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

test("FlowGuardStore persists settings and updates undertaking compliance", () => {
  const saved = FlowGuardStore.saveSettings({
    advanceWarningDays: 21,
    highRiskThresholdDays: 4,
    inactivityAlertDays: 6,
    autoEscalateOverdue48h: false,
    sendSmsDeficiencyAlert: true,
    minOcrConfidencePercent: 75,
    duplicateHashMode: "INTRA_STATE",
  });
  assert.equal(saved.advanceWarningDays, 21);
  assert.equal(FlowGuardStore.getSettings().minOcrConfidencePercent, 75);

  const updatedUnd = FlowGuardStore.updateUndertakingStatus("und-002", "Complied", "Dr. K. N. Patil");
  assert.ok(updatedUnd);
  assert.equal(updatedUnd.status, "Complied");

  FlowGuardStore.resetToDefaultDemo();
});

test("FlowGuardStore generates role-grounded Next Best Actions", () => {
  const actions = FlowGuardStore.getNextBestActions("SCRUTINY_OFFICER");
  assert.ok(actions.length > 0);
  assert.ok(actions.some(a => a.isActionableByCurrentRole));
});
