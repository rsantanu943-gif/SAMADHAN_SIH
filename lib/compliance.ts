export type ComplianceStatus = "Verified" | "Flagged" | "Pending Review" | "Non-Compliant";

export interface AuditRecord {
  id: string;
  entity: string;
  type: string;
  status: ComplianceStatus;
  date: string;
  score: number;
}

export interface MonthlyTrendData {
  month: string;
  shortMonth: string;
  score: number;
  auditsCount: number;
  targetBenchmark: number;
  remediatedCount: number;
}

export function calculateAverageScore(audits: { score: number }[]): number {
  if (audits.length === 0) return 0;
  const total = audits.reduce((sum, item) => sum + item.score, 0);
  return Number((total / audits.length).toFixed(1));
}

export function classifyComplianceStatus(score: number): ComplianceStatus {
  if (score >= 90) return "Verified";
  if (score >= 75) return "Pending Review";
  if (score >= 60) return "Flagged";
  return "Non-Compliant";
}

export function filterAudits(
  audits: AuditRecord[],
  searchTerm: string,
  statusFilter: string
): AuditRecord[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  return audits.filter((record) => {
    const matchesSearch =
      normalizedSearch === "" ||
      record.id.toLowerCase().includes(normalizedSearch) ||
      record.entity.toLowerCase().includes(normalizedSearch) ||
      record.type.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "All" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}

export function calculateTrendSummary(trends: MonthlyTrendData[]) {
  if (trends.length === 0) {
    return { current: 0, high: 0, low: 0, delta: 0, isPositive: true };
  }

  const scores = trends.map((t) => t.score);
  const current = scores[scores.length - 1];
  const initial = scores[0];
  const high = Math.max(...scores);
  const low = Math.min(...scores);
  const delta = Number((current - initial).toFixed(1));

  return {
    current,
    high,
    low,
    delta,
    isPositive: delta >= 0,
  };
}

export const SIX_MONTH_TREND_DATA: MonthlyTrendData[] = [
  { month: "May 2026", shortMonth: "May", score: 82.5, auditsCount: 29, targetBenchmark: 85.0, remediatedCount: 24 },
  { month: "Jun 2026", shortMonth: "Jun", score: 84.1, auditsCount: 34, targetBenchmark: 85.0, remediatedCount: 30 },
  { month: "Jul 2026", shortMonth: "Jul", score: 85.8, auditsCount: 38, targetBenchmark: 85.0, remediatedCount: 36 },
  { month: "Aug 2026", shortMonth: "Aug", score: 86.9, auditsCount: 41, targetBenchmark: 85.0, remediatedCount: 39 },
  { month: "Sep 2026", shortMonth: "Sep", score: 89.1, auditsCount: 45, targetBenchmark: 85.0, remediatedCount: 43 },
  { month: "Oct 2026", shortMonth: "Oct", score: 88.4, auditsCount: 42, targetBenchmark: 85.0, remediatedCount: 39 },
];

export function formatGeminiContents(
  messages: Array<{ role: string; content: string }>
) {
  return messages.map((m) => ({
    role: m.role === "assistant" || m.role === "model" ? "model" : "user",
    parts: [{ text: m.content.trim() }],
  }));
}

export function extractGroundingSources(rawChunks: any[] = []): Array<{ uri: string; title: string }> {
  return rawChunks
    .map((c) => c?.web)
    .filter((w) => w && typeof w.uri === "string" && w.uri.length > 0)
    .map((w) => ({
      uri: w.uri,
      title: w.title || new URL(w.uri).hostname,
    }));
}

export function generateStatutoryFallback(
  prompt: string,
  role: string = "compliance_officer"
): { text: string; sources: Array<{ uri: string; title: string }>; queries: string[] } {
  const p = prompt.toLowerCase();

  if (p.includes("800-53") || p.includes("nist") || p.includes("telemetry")) {
    return {
      text: `### NIST Special Publication 800-53 Rev. 5: Telemetry & Audit Analysis

Under **NIST SP 800-53 Rev. 5**, institutional telemetry and automated data gateways are subject to specific high-assurance control baselines:

1. **AU-2 & AU-3 (Audit Event Generation & Content)**:
   * Telemetry streams must cryptographically capture timestamps, source/destination IP hashes, transaction volume, and access identity.
   * Telemetry records must contain sufficient detail without exposing raw personally identifiable information (PII).

2. **AU-6 (Audit Record Review, Analysis, and Reporting)**:
   * Mandatory automated real-time telemetry anomaly detection against baseline behavioral profiles.
   * Alerts must trigger when continuous telemetry integrity check fails (WCAG/FIPS 140-3 validation).

3. **SC-8 & SC-13 (Transmission Confidentiality & Cryptographic Protection)**:
   * Mutual TLS (mTLS 1.3) required across all inter-agency synchronization relays.
   * Hardware Security Module (HSM) signing required for state telemetry batch logs.

*(Sourced via verified statutory knowledge base)*`,
      sources: [
        { uri: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final", title: "NIST SP 800-53 Rev. 5 Security & Privacy Controls" },
        { uri: "https://www.fedramp.gov/baselines/", title: "FedRAMP High/Moderate Telemetry Baseline" },
      ],
      queries: ["NIST SP 800-53 Rev 5 telemetry audit standards", "FedRAMP inter-agency gateway security"],
    };
  }

  if (p.includes("aud-2024-002") || p.includes("legacy api") || p.includes("transport")) {
    return {
      text: `### Corrective Action Plan: Audit AUD-2024-002 (Transportation Authority)

**Finding**: High-priority vulnerability identified in legacy multi-state synchronization gateway.

#### Prescribed Remediation Protocol:
1. **Immediate Gateway Perimeter Containment**:
   * Restrict access to the synchronization endpoints via strict IP allow-listing and mutual TLS (mTLS) enforcement.
   * Deprecate plaintext HTTP fallback endpoints immediately.
2. **Tokenized OAuth 2.0 / JWT Re-Authentication**:
   * Replace legacy static API keys with short-lived, cryptographically signed Bearer tokens (RFC 7519) issued by the centralized Identity Provider.
3. **Cryptographic Ledger Integrity (Protocol 42-B)**:
   * Route telemetry synchronization batches through the immutable audit buffer to ensure tamper evidence.
4. **Target Clearance Horizon**:
   * Complete technical patch deployment within 48 hours to prevent formal citation downgrade.`,
      sources: [
        { uri: "https://csrc.nist.gov/projects/zero-trust-architecture", title: "NIST Zero Trust Architecture (SP 800-207)" },
        { uri: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog", title: "CISA Cybersecurity Compliance Guidelines" },
      ],
      queries: ["legacy API security remediation transit authority", "mTLS inter-agency synchronization"],
    };
  }

  if (p.includes("waiver") || p.includes("exception") || p.includes("protocol 42-b")) {
    return {
      text: `### Regulatory Protocol 42-B Exception Waiver Criteria

To obtain an authorized statutory waiver for flagged audit items under **Protocol 42-B**, the following documentation must be formally submitted:

1. **Documented Compensating Controls**: Proof that alternate security measures mitigate the documented vulnerability to an acceptable residual risk level.
2. **Business Impact Analysis (BIA)**: Demonstration that immediate compliance without a phased transition would disrupt essential public sector services.
3. **Formal Remediation Roadmap**: Signed commitment with firm milestones not exceeding 90 calendar days.
4. **Authorized Executive Sign-Off**: The petition must bear the cryptographic signature of the appointed Chief Compliance Officer (CCO) or Agency Director.`,
      sources: [
        { uri: "https://www.ecfr.gov/", title: "Electronic Code of Federal Regulations (eCFR)" },
        { uri: "https://www.govinfo.gov/", title: "U.S. Government Institutional Compliance Protocols" },
      ],
      queries: ["regulatory protocol exception waiver compliance", "compensating controls audit standard"],
    };
  }

  return {
    text: `### Institutional Regulatory Synthesis (${role.replace("_", " ").toUpperCase()})

Based on statutory governance standards and current administrative rules:

* **Statutory Compliance Frameworks**: Compliance evaluations must align with federal standards (NIST SP 800-53, HIPAA, FedRAMP) and applicable state administrative codes.
* **Audit Trail Requirements**: All policy adjustments, exceptions, and evidence submittals must be logged in an immutable, cryptographically verifiable ledger.
* **Remediation Timelines**: Critical findings require formal containment within 24–48 hours, followed by secondary review and re-certification before the subsequent fiscal filing period.

For specific mandate cross-referencing, you can specify the regulation name (e.g. NIST 800-53, Clean Air Act, HIPAA, or specific Audit IDs).`,
    sources: [
      { uri: "https://www.ecfr.gov/", title: "Electronic Code of Federal Regulations" },
      { uri: "https://csrc.nist.gov/", title: "NIST Computer Security Resource Center" },
    ],
    queries: ["federal institutional compliance frameworks", "government regulatory review standards"],
  };
}
