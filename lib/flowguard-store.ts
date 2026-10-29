import {
  UserRole,
  Institution,
  Application,
  DocumentRecord,
  EVCEvent,
  Undertaking,
  NotificationRecord,
  AuditLogEntry,
  NextBestActionItem,
  RiskLevel,
  OverlapRecord
} from './types';

// Default Demo User Profile
export interface CurrentUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  designation: string;
  institutionId?: string;
}

export const DEMO_USERS: Record<UserRole, CurrentUserProfile> = {
  SUPER_ADMIN: {
    id: "usr-admin-01",
    name: "Dr. Rameshwar Rao",
    email: "admin.super@aicte-india.org",
    role: "SUPER_ADMIN",
    region: "Headquarters (New Delhi)",
    designation: "Member Secretary, AICTE"
  },
  BUREAU_OFFICER: {
    id: "usr-bureau-02",
    name: "Smt. Sunita Verma",
    email: "bureau.approval@aicte-india.org",
    role: "BUREAU_OFFICER",
    region: "Headquarters (New Delhi)",
    designation: "Advisor - Approval Bureau"
  },
  REGIONAL_OFFICER: {
    id: "usr-ro-03",
    name: "Dr. K. N. Patil",
    email: "ro.western@aicte-india.org",
    role: "REGIONAL_OFFICER",
    region: "Western",
    designation: "Regional Officer, WRO Mumbai"
  },
  SCRUTINY_OFFICER: {
    id: "usr-scrutiny-04",
    name: "Prof. Arvind S. Kulkarni",
    email: "scrutiny.west01@aicte-india.org",
    role: "SCRUTINY_OFFICER",
    region: "Western",
    designation: "Chairman - Institutional Scrutiny Committee"
  },
  EVC_COORDINATOR: {
    id: "usr-evc-05",
    name: "Dr. Meenakshi Sundaram",
    email: "evc.coord.west@aicte-india.org",
    role: "EVC_COORDINATOR",
    region: "Western",
    designation: "Coordinator, Expert Visiting Committee"
  },
  INSTITUTION_ADMIN: {
    id: "usr-inst-06",
    name: "Dr. Sudhir V. Joshi",
    email: "principal@vjti.ac.in",
    role: "INSTITUTION_ADMIN",
    region: "Western",
    designation: "Principal & Authorized Signatory",
    institutionId: "inst-001"
  },
  READONLY_AUDITOR: {
    id: "usr-auditor-07",
    name: "G. S. Rathore, IRS",
    email: "auditor.external@cag.gov.in",
    role: "READONLY_AUDITOR",
    region: "National Oversight",
    designation: "Senior Deputy Director - Statutory Audit"
  }
};

// Initial Seed Institutions
export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: "inst-001",
    permanentId: "1-4029102",
    name: "Veermata Jijabai Technological Institute (VJTI)",
    region: "Western",
    address: "H.R. Mahajani Marg, Matunga, Mumbai, Maharashtra - 400019",
    category: "Engineering & Technology",
    establishedYear: 1887,
    authorizedAdminName: "Dr. Sudhir V. Joshi",
    authorizedAdminEmail: "principal@vjti.ac.in",
    contactPhone: "+91 22 2419 8101",
    complianceScore: 94.5,
    status: "Compliant",
    landAreaAcres: 16.4,
    totalFaculty: 182,
    approvedIntake: 1240
  },
  {
    id: "inst-002",
    permanentId: "1-7391823",
    name: "Sardar Vallabhbhai National Institute of Technology",
    region: "Western",
    address: "Ichchhanath, Surat, Gujarat - 395007",
    category: "Engineering & Technology",
    establishedYear: 1961,
    authorizedAdminName: "Dr. Anupam Shukla",
    authorizedAdminEmail: "director@svnit.ac.in",
    contactPhone: "+91 261 225 9571",
    complianceScore: 89.0,
    status: "Under Review",
    landAreaAcres: 250.0,
    totalFaculty: 240,
    approvedIntake: 1550
  },
  {
    id: "inst-003",
    permanentId: "1-9128301",
    name: "Oxford Institute of Technology & Management",
    region: "Northern",
    address: "Plot 14, Knowledge Park III, Greater Noida, Uttar Pradesh - 201308",
    category: "Engineering & Technology",
    establishedYear: 2008,
    authorizedAdminName: "Dr. Rajiv Singhal",
    authorizedAdminEmail: "director@oxfordtech.edu.in",
    contactPhone: "+91 120 456 7890",
    complianceScore: 61.2,
    status: "Deficiencies Outstanding",
    landAreaAcres: 4.8, // Flagged: < 5.0 acres norm for engineering in metro/sub-urban
    totalFaculty: 68,
    approvedIntake: 420
  },
  {
    id: "inst-004",
    permanentId: "1-5582910",
    name: "Kalinga School of Pharmacy & Life Sciences",
    region: "Eastern",
    address: "Campus 5, Patia, Bhubaneswar, Odisha - 751024",
    category: "Pharmacy",
    establishedYear: 2012,
    authorizedAdminName: "Prof. Manmath Tripathy",
    authorizedAdminEmail: "dean.pharm@kalinga.edu.in",
    contactPhone: "+91 674 272 5113",
    complianceScore: 78.4,
    status: "High Risk Alert",
    landAreaAcres: 5.2,
    totalFaculty: 42,
    approvedIntake: 180
  },
  {
    id: "inst-005",
    permanentId: "1-3382914",
    name: "B.M.S. College of Engineering",
    region: "South-Western",
    address: "Bull Temple Road, Basavanagudi, Bengaluru, Karnataka - 560019",
    category: "Engineering & Technology",
    establishedYear: 1946,
    authorizedAdminName: "Dr. S. Muralidhara",
    authorizedAdminEmail: "principal@bmsce.ac.in",
    contactPhone: "+91 80 2662 2130",
    complianceScore: 92.8,
    status: "Compliant",
    landAreaAcres: 15.0,
    totalFaculty: 310,
    approvedIntake: 1860
  }
];

// Initial Seed Applications
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    applicationNumber: "APP-2026-AICTE-102",
    institutionId: "inst-001",
    institutionName: "Veermata Jijabai Technological Institute (VJTI)",
    region: "Western",
    category: "Extension of Approval (EoA) + Intake Increase (AI/ML)",
    academicYear: "2026-27",
    workflowTemplate: "Standard (Scrutiny + EVC + SAC)",
    currentStage: "Scrutiny",
    status: "Under Scrutiny",
    assignedOfficerName: "Prof. Arvind S. Kulkarni",
    assignedOfficerRole: "SCRUTINY_OFFICER",
    submissionDate: "2026-10-18",
    deadline: "2026-10-30", // 2 days remaining from current time (Oct 28)
    lastActionDate: "2026-10-22", // 6 days inactive
    daysRemaining: 2,
    riskLevel: "High Risk",
    riskReason: "Configured scrutiny deadline is approaching in 2 days and no committee action has been recorded for 6 days.",
    recommendedAction: "Review assigned scrutiny task, verify uploaded land/building documents, and record committee findings.",
    deficiencies: [],
    prerequisitesMet: true,
    version: "v2026.1"
  },
  {
    id: "app-002",
    applicationNumber: "APP-2026-AICTE-088",
    institutionId: "inst-003",
    institutionName: "Oxford Institute of Technology & Management",
    region: "Northern",
    category: "Conversion of Diploma to Degree & New Course Approval",
    academicYear: "2026-27",
    workflowTemplate: "Standard (Scrutiny + EVC + SAC)",
    currentStage: "EVC Scheduling",
    status: "Awaiting EVC",
    assignedOfficerName: "Dr. Meenakshi Sundaram",
    assignedOfficerRole: "EVC_COORDINATOR",
    submissionDate: "2026-09-28",
    deadline: "2026-10-24", // 4 days overdue!
    lastActionDate: "2026-10-20",
    daysRemaining: -4,
    riskLevel: "Overdue",
    riskReason: "EVC Committee constitution & visit scheduling expired on Oct 24, 2026. Statutory inspection window lapsed.",
    recommendedAction: "Immediately empanel 3-member Expert Committee, confirm date with Institution, or submit deferral justification.",
    deficiencies: ["Land area certified as 4.8 acres (sub-norm for Degree Engineering)", "Affiliating University NOC pending syndicate sign-off"],
    prerequisitesMet: false,
    blockingReason: "Scrutiny deficiency regarding minimum land area remains unaddressed by institution.",
    version: "v2026.1"
  },
  {
    id: "app-003",
    applicationNumber: "APP-2026-AICTE-115",
    institutionId: "inst-002",
    institutionName: "Sardar Vallabhbhai National Institute of Technology",
    region: "Western",
    category: "Establishment of New Supercomputing Research Center",
    academicYear: "2026-27",
    workflowTemplate: "Only Scrutiny (Extension of Approval - EoA)",
    currentStage: "Scrutiny",
    status: "Resubmitted",
    assignedOfficerName: "Prof. Arvind S. Kulkarni",
    assignedOfficerRole: "SCRUTINY_OFFICER",
    submissionDate: "2026-10-10",
    deadline: "2026-11-04",
    lastActionDate: "2026-10-27",
    daysRemaining: 7,
    riskLevel: "Attention Required",
    riskReason: "Application resubmitted with amended fire safety clearance. Scrutiny re-verification pending.",
    recommendedAction: "Verify resubmitted Fire NOC certificate and resolve earlier deficiency ticket.",
    deficiencies: ["Fire NOC validity was expired in initial upload; revised document uploaded Oct 27."],
    prerequisitesMet: true,
    version: "v2026.1"
  },
  {
    id: "app-004",
    applicationNumber: "APP-2026-AICTE-142",
    institutionId: "inst-004",
    institutionName: "Kalinga School of Pharmacy & Life Sciences",
    region: "Eastern",
    category: "Restoration of Intake & PCI Harmonization",
    academicYear: "2026-27",
    workflowTemplate: "EVC + SAC/SHC",
    currentStage: "Deficiencies",
    status: "Deficiencies Raised",
    assignedOfficerName: "Dr. K. N. Patil",
    assignedOfficerRole: "REGIONAL_OFFICER",
    submissionDate: "2026-10-01",
    deadline: "2026-10-31",
    lastActionDate: "2026-10-25",
    daysRemaining: 3,
    riskLevel: "High Risk",
    riskReason: "Institution has 3 days remaining to comply with Pharmacopoeia laboratory equipment undertaking.",
    recommendedAction: "Track institution compliance submission and alert Dean regarding deadline lapse.",
    deficiencies: ["Missing Machine Room layout approval", "Cadre ratio for Associate Professors below 1:2:6 mandatory norm"],
    prerequisitesMet: false,
    blockingReason: "Institution response pending.",
    version: "v2026.1"
  },
  {
    id: "app-005",
    applicationNumber: "APP-2026-AICTE-099",
    institutionId: "inst-005",
    institutionName: "B.M.S. College of Engineering",
    region: "South-Western",
    category: "Extension of Approval (EoA) Routine",
    academicYear: "2026-27",
    workflowTemplate: "Only Scrutiny (Extension of Approval - EoA)",
    currentStage: "Final Approval",
    status: "Approved",
    assignedOfficerName: "Smt. Sunita Verma",
    assignedOfficerRole: "BUREAU_OFFICER",
    submissionDate: "2026-09-15",
    deadline: "2026-10-15",
    lastActionDate: "2026-10-14",
    daysRemaining: 17,
    riskLevel: "Normal",
    riskReason: "All procedural stages completed within normative timelines. LoA released on Oct 14.",
    recommendedAction: "No action required. Archived in current academic cycle registry.",
    deficiencies: [],
    prerequisitesMet: true,
    version: "v2026.1"
  }
];

// Initial Seed Documents
export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-001",
    institutionId: "inst-001",
    institutionName: "Veermata Jijabai Technological Institute (VJTI)",
    applicationId: "app-001",
    category: "Land Lease / Ownership Deed",
    title: "Registered 99-Year Perpetual Lease Deed (Govt of Maharashtra)",
    fileName: "VJTI_LeaseDeed_Vol_402_Reg.pdf",
    fileSize: "4.8 MB",
    fileHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    uploadDate: "2026-10-18",
    issueDate: "1932-04-15",
    expiryDate: "2031-04-14",
    daysToExpiry: 1629,
    isExpiringSoon: false,
    isExpired: false,
    extractedMetadata: {
      deedRegistrationNo: "BOM/MAT/1932/40291",
      surveyPlotNo: "Plot 102 & 104, Wadala Division",
      areaAcres: 16.4,
      issuingAuthority: "Collector & District Magistrate, Mumbai City",
      validUntil: "2031-04-14",
      stampDutyPaid: "₹5,000 (Historic) / Re-endorsed 2012",
      notarized: true,
      confidenceScore: 0.96
    },
    ocrFlags: ["Perpetual government lease verified", "Survey plot boundaries match revenue survey extract"],
    verificationStatus: "VERIFIED",
    verifiedBy: "Prof. Arvind S. Kulkarni",
    verifiedAt: "2026-10-21 14:30 IST",
    verificationRemarks: "Verified against State Revenue Records. Area exceeds 5.0 acre urban requirement.",
    versionNumber: 1
  },
  {
    id: "doc-002",
    institutionId: "inst-003",
    institutionName: "Oxford Institute of Technology & Management",
    applicationId: "app-002",
    category: "Land Lease / Ownership Deed",
    title: "Registered Sub-Lease Agreement - Greater Noida Authority",
    fileName: "OITM_SubLease_KP3_Reg.pdf",
    fileSize: "2.1 MB",
    fileHash: "9f83c6057773ec37d43f734a9b35c7d24220bdae0f94684b396d397240c87dee",
    uploadDate: "2026-09-28",
    issueDate: "2006-11-15",
    expiryDate: "2026-11-15", // Expiring in 18 days!
    daysToExpiry: 18,
    isExpiringSoon: true,
    isExpired: false,
    extractedMetadata: {
      deedRegistrationNo: "GN-KP3-REG-2006/884",
      surveyPlotNo: "Plot 14, Sector KP-III",
      areaAcres: 4.8, // Deficient!
      issuingAuthority: "Greater Noida Industrial Dev Authority (GNIDA)",
      validUntil: "2026-11-15",
      stampDutyPaid: "₹24,50,000",
      notarized: true,
      confidenceScore: 0.88
    },
    ocrFlags: [
      "POTENTIAL EXPIRY: Lease term expires on 2026-11-15 (in 18 days). Renewal deed required.",
      "AREA DEFICIENCY: Extracted area 4.80 Acres is below AICTE norm of 5.0 Acres for Mega/Metro degree engineering.",
      "Contiguous land certificate missing second schedule endorsement."
    ],
    verificationStatus: "RETURNED",
    verifiedBy: "Prof. Arvind S. Kulkarni",
    verifiedAt: "2026-10-15 11:20 IST",
    verificationRemarks: "Document flagged: (1) Lease expires in November 2026, renewal undertaking needed; (2) Total land area 4.8 acres is below statutory 5.0 acre threshold.",
    versionNumber: 1
  },
  {
    id: "doc-003",
    institutionId: "inst-003",
    institutionName: "Oxford Institute of Technology & Management",
    applicationId: "app-002",
    category: "Building Plan & Occupancy Certificate",
    title: "Architect Building Completion & Structural Safety Certificate",
    fileName: "OITM_BuildingPlan_Occupancy_Scan.pdf",
    fileSize: "6.4 MB",
    fileHash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    uploadDate: "2026-09-29",
    isExpiringSoon: false,
    isExpired: false,
    extractedMetadata: {
      issuingAuthority: "Private Registered Architect",
      confidenceScore: 0.42 // Low confidence / unreadable OCR
    },
    ocrFlags: [
      "UNREADABLE SECTIONS: Council of Architecture (COA) registration seal is degraded (OCR confidence 42%).",
      "MISSING FIELD: Local municipal occupancy certificate number cannot be parsed from header.",
      "Flagged for mandatory human scrutiny officer review before acceptance."
    ],
    verificationStatus: "PENDING",
    versionNumber: 1
  },
  {
    id: "doc-004",
    institutionId: "inst-001",
    institutionName: "Veermata Jijabai Technological Institute (VJTI)",
    applicationId: "app-001",
    category: "Fire Safety NOC",
    title: "Mumbai Fire Brigade Annual Compliance NOC (Form B)",
    fileName: "MFB_FireNOC_FormB_2026.pdf",
    fileSize: "1.4 MB",
    fileHash: "3f79bb7b435b053214716200502467d033d4a2a466a4583228976eb0fa1e02c6",
    uploadDate: "2026-10-18",
    issueDate: "2026-05-10",
    expiryDate: "2027-05-09",
    daysToExpiry: 193,
    isExpiringSoon: false,
    isExpired: false,
    extractedMetadata: {
      deedRegistrationNo: "FB/WAD/NOC/2026/184",
      issuingAuthority: "Chief Fire Officer, Municipal Corp of Greater Mumbai",
      validUntil: "2027-05-09",
      notarized: true,
      confidenceScore: 0.98
    },
    ocrFlags: ["Clear certificate detected", "Riser test & sprinkler hydrants verified compliant"],
    verificationStatus: "PENDING",
    versionNumber: 1
  },
  {
    id: "doc-005",
    institutionId: "inst-004",
    institutionName: "Kalinga School of Pharmacy & Life Sciences",
    applicationId: "app-004",
    category: "Faculty Cadre & AICTE Pay Scale Undertaking",
    title: "6th/7th CPC Salary Disbursement & Bank Statement Undertaking",
    fileName: "Kalinga_PayScale_BankUndertaking_2026.pdf",
    fileSize: "3.2 MB",
    fileHash: "9f83c6057773ec37d43f734a9b35c7d24220bdae0f94684b396d397240c87dee", // Duplicate hash test!
    uploadDate: "2026-10-02",
    issueDate: "2026-09-30",
    expiryDate: "2027-09-29",
    isExpiringSoon: false,
    isExpired: false,
    extractedMetadata: {
      deedRegistrationNo: "NOTARY/BBSR/2026/719",
      issuingAuthority: "First Class Judicial Magistrate, Bhubaneswar",
      notarized: true,
      confidenceScore: 0.81
    },
    ocrFlags: [
      "DUPLICATE HASH ALERT: Exact byte-identical file hash matches previously submitted doc in Eastern Region (APP-2025-E-401). Human verification essential."
    ],
    verificationStatus: "PENDING",
    versionNumber: 1
  }
];

// Initial Seed EVC Events
export const INITIAL_EVC_EVENTS: EVCEvent[] = [
  {
    id: "evc-001",
    applicationId: "app-002",
    institutionId: "inst-003",
    institutionName: "Oxford Institute of Technology & Management",
    region: "Northern",
    scheduledDate: "2026-10-24", // Lapsed date
    status: "Awaiting Schedule",
    committeeMembers: ["Dr. R. K. Mittal (BITS Pilani)", "Prof. Neeraj Sharma (IIT BHU)", "Ar. S. P. Bansal (Architect Member)"],
    leadAuditor: "Dr. R. K. Mittal",
    inspectionMode: "Physical On-Site",
    geotagVerified: false,
    deficienciesNoted: ["Land sub-lease renewal deed pending", "Computer lab terminal count short by 40 systems"],
    assignedDate: "2026-10-12"
  },
  {
    id: "evc-002",
    applicationId: "app-001",
    institutionId: "inst-001",
    institutionName: "Veermata Jijabai Technological Institute (VJTI)",
    region: "Western",
    scheduledDate: "2026-11-08",
    status: "Scheduled",
    committeeMembers: ["Prof. Devang Khakhar (IIT Bombay)", "Dr. S. B. Bodkhe (VNIT Nagpur)"],
    leadAuditor: "Prof. Devang Khakhar",
    inspectionMode: "Hybrid Geo-Tagged",
    geotagVerified: true,
    deficienciesNoted: [],
    assignedDate: "2026-10-20"
  }
];

// Initial Seed Undertakings
export const INITIAL_UNDERTAKINGS: Undertaking[] = [
  {
    id: "und-001",
    institutionId: "inst-001",
    institutionName: "Veermata Jijabai Technological Institute (VJTI)",
    applicationId: "app-001",
    title: "Anti-Ragging Committee & National Portal Registration",
    clause: "AICTE Regulations 2009 (F.No.37-3/Legal/AICTE/2009)",
    issuedDate: "2026-07-01",
    deadline: "2026-11-30",
    daysRemaining: 33,
    status: "Complied",
    penaltyClause: "Withdrawal of Approval for subsequent academic batch.",
    submittedDocumentId: "doc-004",
    resolvedAt: "2026-08-14"
  },
  {
    id: "und-002",
    institutionId: "inst-003",
    institutionName: "Oxford Institute of Technology & Management",
    applicationId: "app-002",
    title: "Land Lease Extension Guarantee to 30 Years Registered Deed",
    clause: "AICTE Approval Process Handbook (APH) 2026 Appendix 4 Cl. 4.1",
    issuedDate: "2026-10-15",
    deadline: "2026-11-05",
    daysRemaining: 8,
    status: "Pending Submission",
    penaltyClause: "Rejection of Application and forfeiture of processing fee.",
  },
  {
    id: "und-003",
    institutionId: "inst-004",
    institutionName: "Kalinga School of Pharmacy & Life Sciences",
    applicationId: "app-004",
    title: "Faculty Cadre Rectification & 7th CPC Salary Implementation",
    clause: "AICTE Pay Scales & Service Conditions Notification 2019",
    issuedDate: "2026-09-01",
    deadline: "2026-10-20", // Past deadline!
    daysRemaining: -8,
    status: "Overdue",
    penaltyClause: "Reduction of Approved Intake by 50% for AY 2026-27.",
  }
];

// Initial Seed Notifications
export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "notif-001",
    type: "DEADLINE_APPROACHING",
    priority: "high",
    title: "Scrutiny Deadline in 2 Days: APP-2026-AICTE-102",
    message: "Application for VJTI has 2 days remaining until statutory scrutiny window expires on Oct 30. No action recorded for 6 days.",
    recipientRole: "SCRUTINY_OFFICER",
    recipientName: "Prof. Arvind S. Kulkarni",
    institutionId: "inst-001",
    applicationId: "app-001",
    createdAt: "2026-10-28 07:10 IST",
    read: false,
    acknowledged: false,
    resolved: false
  },
  {
    id: "notif-002",
    type: "STAGE_OVERDUE",
    priority: "critical",
    title: "OVERDUE EVC Stage: APP-2026-AICTE-088",
    message: "Oxford Institute of Technology EVC scheduling stage lapsed on Oct 24, 2026. Task has been flagged on the Deadline Risk Radar.",
    recipientRole: "EVC_COORDINATOR",
    recipientName: "Dr. Meenakshi Sundaram",
    institutionId: "inst-003",
    applicationId: "app-002",
    createdAt: "2026-10-25 09:00 IST",
    read: true,
    acknowledged: true,
    resolved: false,
    escalatedTo: "Dr. K. N. Patil (Regional Officer, WRO)"
  },
  {
    id: "notif-003",
    type: "DOCUMENT_EXPIRING",
    priority: "medium",
    title: "Lease Document Expiring Soon: Oxford Institute",
    message: "Land Sub-Lease Deed (GN-KP3-REG-2006/884) expires on Nov 15, 2026 (18 days remaining). Formal renewal or extension registered deed required.",
    recipientRole: "REGIONAL_OFFICER",
    recipientName: "Dr. K. N. Patil",
    institutionId: "inst-003",
    applicationId: "app-002",
    createdAt: "2026-10-28 06:00 IST",
    read: false,
    acknowledged: false,
    resolved: false
  },
  {
    id: "notif-004",
    type: "ESCALATION",
    priority: "critical",
    title: "System Escalation: Unresolved Deficiency Deadline",
    message: "Kalinga School of Pharmacy undertaking deadline lapsed 8 days ago without compliant submission. Automatic escalation to Regional Bureau Head.",
    recipientRole: "BUREAU_OFFICER",
    recipientName: "Smt. Sunita Verma",
    institutionId: "inst-004",
    applicationId: "app-004",
    createdAt: "2026-10-27 16:45 IST",
    read: false,
    acknowledged: false,
    resolved: false
  }
];

// Initial Seed Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-10-28 07:15:20 IST",
    actorName: "System Automated Engine",
    actorRole: "SYSTEM_ENGINE",
    action: "DEADLINE_RISK_RECALCULATION",
    targetType: "APPLICATION",
    targetId: "APP-2026-AICTE-102",
    details: "Computed daysRemaining=2, lastActionAge=6d. Rule #R-04 triggered: Attention Required elevated to High Risk.",
    ipAddress: "10.0.4.12 (Internal Cron)",
    verifiedHash: "sha256:7f4a...92b1"
  },
  {
    id: "aud-002",
    timestamp: "2026-10-27 14:12:05 IST",
    actorName: "Dr. Sudhir V. Joshi",
    actorRole: "INSTITUTION_ADMIN",
    action: "DEFICIENCY_DOCUMENT_RESUBMIT",
    targetType: "DOCUMENT",
    targetId: "doc-004",
    details: "Uploaded renewed Mumbai Fire Brigade Form B NOC. Status transitioned to Under Scrutiny.",
    ipAddress: "115.112.44.18 (VJTI Campus Network)",
    verifiedHash: "sha256:3a1b...88c4"
  },
  {
    id: "aud-003",
    timestamp: "2026-10-25 11:30:00 IST",
    actorName: "Prof. Arvind S. Kulkarni",
    actorRole: "SCRUTINY_OFFICER",
    action: "DOCUMENT_VERIFIED",
    targetType: "DOCUMENT",
    targetId: "doc-001",
    details: "Marked Land Lease Deed BOM/MAT/1932/40291 as VERIFIED. Confirmed 16.4 acres meets urban norms.",
    ipAddress: "14.139.111.4 (AICTE Scrutiny Portal)",
    verifiedHash: "sha256:92fd...61e0"
  },
  {
    id: "aud-004",
    timestamp: "2026-10-24 18:00:00 IST",
    actorName: "System Automated Engine",
    actorRole: "SYSTEM_ENGINE",
    action: "STAGE_OVERDUE_TRIGGER",
    targetType: "APPLICATION",
    targetId: "APP-2026-AICTE-088",
    details: "EVC scheduling deadline reached without confirmed committee visit. Status set to OVERDUE.",
    ipAddress: "10.0.4.12 (Internal Cron)",
    verifiedHash: "sha256:cc89...14ff"
  }
];

// Initial Seed Overlaps
export const INITIAL_OVERLAPS: OverlapRecord[] = [
  {
    id: "ovl-001",
    type: "DUPLICATE_FILE_HASH",
    severity: "CRITICAL",
    primaryInstitutionId: "inst-004",
    primaryInstitutionName: "Kalinga School of Pharmacy & Life Sciences",
    primaryApplicationId: "app-004",
    targetInstitutionId: "inst-003",
    targetInstitutionName: "Oxford Institute of Technology & Management",
    targetApplicationId: "app-002",
    matchedField: "SHA-256 Document File Hash",
    matchedValue: "9f83c6057773ec37d43f734a9b35c7d24220bdae0f94684b396d397240c87dee",
    confidenceScore: 1.0,
    detectedAt: "2026-10-26 11:20 IST",
    status: "UNREVIEWED"
  },
  {
    id: "ovl-002",
    type: "LAND_PLOT_COLLISION",
    severity: "HIGH",
    primaryInstitutionId: "inst-003",
    primaryInstitutionName: "Oxford Institute of Technology & Management",
    primaryApplicationId: "app-002",
    targetInstitutionId: "inst-003-alt",
    targetInstitutionName: "KP-3 Polytechnic Society (Legacy Record)",
    matchedField: "Revenue Plot / Survey No.",
    matchedValue: "Plot 14, Sector KP-III, Greater Noida",
    confidenceScore: 0.92,
    detectedAt: "2026-10-22 09:45 IST",
    status: "UNREVIEWED"
  }
];

// Helper to safely access and persist in localStorage (browser environment)
const STORAGE_KEY_PREFIX = "aicte_flowguard_v1_";

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn("Storage write failed", err);
  }
}

// In-Memory Fallback State (when running SSR or if localStorage disabled)
let appsState: Application[] = [...INITIAL_APPLICATIONS];
let docsState: DocumentRecord[] = [...INITIAL_DOCUMENTS];
let instState: Institution[] = [...INITIAL_INSTITUTIONS];
let evcState: EVCEvent[] = [...INITIAL_EVC_EVENTS];
let undertakingsState: Undertaking[] = [...INITIAL_UNDERTAKINGS];
let notifsState: NotificationRecord[] = [...INITIAL_NOTIFICATIONS];
let auditState: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
let overlapsState: OverlapRecord[] = [...INITIAL_OVERLAPS];
let currentRoleState: UserRole = "SCRUTINY_OFFICER";

export const FlowGuardStore = {
  // Current Active Role & User
  getCurrentRole(): UserRole {
    return getStorage<UserRole>("current_role", currentRoleState);
  },
  
  setCurrentRole(role: UserRole): void {
    currentRoleState = role;
    setStorage("current_role", role);
  },

  getCurrentUser(): CurrentUserProfile {
    const role = this.getCurrentRole();
    return DEMO_USERS[role] || DEMO_USERS.SCRUTINY_OFFICER;
  },

  // Applications
  getApplications(filter?: { region?: string; riskLevel?: string; stage?: string; institutionId?: string }): Application[] {
    const apps = getStorage<Application[]>("applications", appsState);
    if (!filter) return apps;
    return apps.filter(app => {
      if (filter.region && filter.region !== "All" && app.region !== filter.region) return false;
      if (filter.riskLevel && filter.riskLevel !== "All" && app.riskLevel !== filter.riskLevel) return false;
      if (filter.stage && filter.stage !== "All" && app.currentStage !== filter.stage) return false;
      if (filter.institutionId && app.institutionId !== filter.institutionId) return false;
      return true;
    });
  },

  getApplicationById(id: string): Application | undefined {
    const apps = this.getApplications();
    return apps.find(a => a.id === id || a.applicationNumber === id);
  },

  updateApplicationStage(
    appId: string, 
    newStage: Application['currentStage'], 
    newStatus: Application['status'], 
    actorName: string, 
    remarks: string
  ): Application | null {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === appId || a.applicationNumber === appId);
    if (idx === -1) return null;

    const oldStage = apps[idx].currentStage;
    const today = new Date().toISOString().split("T")[0];

    apps[idx] = {
      ...apps[idx],
      currentStage: newStage,
      status: newStatus,
      lastActionDate: today,
      riskLevel: newStatus === "Approved" ? "Normal" : apps[idx].riskLevel,
      riskReason: newStatus === "Approved" ? "Application concluded successfully." : `Stage updated to ${newStage}. ${remarks}`
    };

    appsState = apps;
    setStorage("applications", apps);

    this.logAudit({
      actorName,
      actorRole: this.getCurrentRole(),
      action: "STAGE_TRANSITION",
      targetType: "APPLICATION",
      targetId: apps[idx].applicationNumber,
      details: `Advanced workflow from [${oldStage}] to [${newStage}]. Status: ${newStatus}. Remarks: ${remarks}`
    });

    return apps[idx];
  },

  returnForDeficiencies(appId: string, deficiencies: string[], actorName: string): Application | null {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === appId || a.applicationNumber === appId);
    if (idx === -1) return null;

    apps[idx] = {
      ...apps[idx],
      currentStage: "Deficiencies",
      status: "Deficiencies Raised",
      deficiencies: [...apps[idx].deficiencies, ...deficiencies],
      prerequisitesMet: false,
      blockingReason: `Deficiencies issued: ${deficiencies.join("; ")}`,
      riskLevel: "Attention Required",
      riskReason: "Deficiencies raised by Scrutiny Committee. Institution has 15 days to resubmit corrected documents."
    };

    appsState = apps;
    setStorage("applications", apps);

    // Create deficiency notification
    this.createNotification({
      type: "DEFICIENCY_ISSUED",
      priority: "high",
      title: `Deficiency Raised on ${apps[idx].applicationNumber}`,
      message: `Scrutiny Committee flagged ${deficiencies.length} observation(s). Corrected documents must be submitted immediately.`,
      recipientRole: "INSTITUTION_ADMIN",
      recipientName: apps[idx].institutionName,
      institutionId: apps[idx].institutionId,
      applicationId: apps[idx].id
    });

    this.logAudit({
      actorName,
      actorRole: this.getCurrentRole(),
      action: "DEFICIENCY_NOTICE_ISSUED",
      targetType: "APPLICATION",
      targetId: apps[idx].applicationNumber,
      details: `Returned with mandatory reasons: ${deficiencies.join(" | ")}`
    });

    return apps[idx];
  },

  resubmitApplication(appId: string, actorName: string): Application | null {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === appId || a.applicationNumber === appId);
    if (idx === -1) return null;

    apps[idx] = {
      ...apps[idx],
      currentStage: "Scrutiny",
      status: "Resubmitted",
      lastActionDate: new Date().toISOString().split("T")[0],
      prerequisitesMet: true,
      blockingReason: undefined,
      riskLevel: "Attention Required",
      riskReason: "Institution uploaded compliance corrections. Scrutiny re-verification active."
    };

    appsState = apps;
    setStorage("applications", apps);

    this.logAudit({
      actorName,
      actorRole: this.getCurrentRole(),
      action: "APPLICATION_RESUBMISSION",
      targetType: "APPLICATION",
      targetId: apps[idx].applicationNumber,
      details: "Corrective records and undertakings submitted by institution."
    });

    return apps[idx];
  },

  createApplication(newApp: {
    institutionId: string;
    institutionName: string;
    region: Application['region'];
    category: string;
    academicYear?: string;
    workflowTemplate?: Application['workflowTemplate'];
    assignedOfficerName?: string;
    assignedOfficerRole?: UserRole;
  }): Application {
    const apps = this.getApplications();
    const id = `app-${Date.now().toString().slice(-4)}`;
    const appNum = `APP-2026-SAMADHAN-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split("T")[0];
    const deadlineDate = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

    const fullApp: Application = {
      id,
      applicationNumber: appNum,
      institutionId: newApp.institutionId,
      institutionName: newApp.institutionName,
      region: newApp.region,
      category: newApp.category,
      academicYear: newApp.academicYear || "2026-27",
      workflowTemplate: newApp.workflowTemplate || "Standard (Scrutiny + EVC + SAC)",
      currentStage: "Scrutiny",
      status: "Submitted",
      assignedOfficerName: newApp.assignedOfficerName || "Prof. Arvind S. Kulkarni",
      assignedOfficerRole: newApp.assignedOfficerRole || "SCRUTINY_OFFICER",
      submissionDate: today,
      deadline: deadlineDate,
      lastActionDate: today,
      daysRemaining: 14,
      riskLevel: "Normal",
      riskReason: "Fresh submission logged and queued for initial documentary scrutiny.",
      recommendedAction: "Initiate documentary verification of uploaded land, building, and faculty records.",
      deficiencies: [],
      prerequisitesMet: true,
      version: "v2026.1"
    };

    apps.unshift(fullApp);
    appsState = apps;
    setStorage("applications", apps);

    this.logAudit({
      actorName: this.getCurrentUser().name,
      actorRole: this.getCurrentRole(),
      action: "APPLICATION_CREATED",
      targetType: "APPLICATION",
      targetId: appNum,
      details: `Lodged new complaint/application for ${fullApp.institutionName} [Category: ${fullApp.category}]`
    });

    return fullApp;
  },

  // Institutions
  getInstitutions(): Institution[] {
    return getStorage<Institution[]>("institutions", instState);
  },

  getInstitutionById(id: string): Institution | undefined {
    const list = this.getInstitutions();
    return list.find(i => i.id === id || i.permanentId === id);
  },

  // Documents
  getDocuments(filter?: { institutionId?: string; applicationId?: string; category?: string; status?: string }): DocumentRecord[] {
    const docs = getStorage<DocumentRecord[]>("documents", docsState);
    if (!filter) return docs;
    return docs.filter(d => {
      if (filter.institutionId && d.institutionId !== filter.institutionId) return false;
      if (filter.applicationId && d.applicationId !== filter.applicationId) return false;
      if (filter.category && filter.category !== "All" && d.category !== filter.category) return false;
      if (filter.status && filter.status !== "All" && d.verificationStatus !== filter.status) return false;
      return true;
    });
  },

  getDocumentById(id: string): DocumentRecord | undefined {
    const docs = this.getDocuments();
    return docs.find(d => d.id === id);
  },

  verifyDocument(
    docId: string, 
    status: DocumentRecord['verificationStatus'], 
    remarks: string, 
    actorName: string
  ): DocumentRecord | null {
    const docs = this.getDocuments();
    const idx = docs.findIndex(d => d.id === docId);
    if (idx === -1) return null;

    const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    docs[idx] = {
      ...docs[idx],
      verificationStatus: status,
      verifiedBy: actorName,
      verifiedAt: nowStr,
      verificationRemarks: remarks
    };

    docsState = docs;
    setStorage("documents", docs);

    this.logAudit({
      actorName,
      actorRole: this.getCurrentRole(),
      action: `DOCUMENT_${status}`,
      targetType: "DOCUMENT",
      targetId: docId,
      details: `Verification outcome: ${status}. Remarks: ${remarks}. Category: ${docs[idx].category}`
    });

    return docs[idx];
  },

  uploadDocument(newDoc: Omit<DocumentRecord, "id" | "uploadDate" | "versionNumber">): DocumentRecord {
    const docs = this.getDocuments();
    const id = `doc-${Date.now().toString().slice(-4)}`;
    const fullDoc: DocumentRecord = {
      ...newDoc,
      id,
      uploadDate: new Date().toISOString().split("T")[0],
      versionNumber: 1
    };

    docs.unshift(fullDoc);
    docsState = docs;
    setStorage("documents", docs);

    this.logAudit({
      actorName: this.getCurrentUser().name,
      actorRole: this.getCurrentRole(),
      action: "DOCUMENT_UPLOAD",
      targetType: "DOCUMENT",
      targetId: id,
      details: `Uploaded ${fullDoc.title} (${fullDoc.fileName}) for institution ${fullDoc.institutionName}. Hash: ${fullDoc.fileHash.slice(0, 10)}...`
    });

    return fullDoc;
  },

  // EVC
  getEVCEvents(): EVCEvent[] {
    return getStorage<EVCEvent[]>("evc_events", evcState);
  },

  scheduleEVCVisit(eventId: string, scheduledDate: string, members: string[], leadAuditor: string): EVCEvent | null {
    const events = this.getEVCEvents();
    const idx = events.findIndex(e => e.id === eventId);
    if (idx === -1) return null;

    events[idx] = {
      ...events[idx],
      scheduledDate,
      committeeMembers: members,
      leadAuditor,
      status: "Scheduled"
    };

    evcState = events;
    setStorage("evc_events", events);

    // Also update associated application stage
    this.updateApplicationStage(
      events[idx].applicationId,
      "EVC Inspection",
      "Awaiting EVC",
      leadAuditor,
      `EVC scheduled for ${scheduledDate} with ${members.length} members.`
    );

    return events[idx];
  },

  // Undertakings
  getUndertakings(): Undertaking[] {
    return getStorage<Undertaking[]>("undertakings", undertakingsState);
  },

  // Notifications
  getNotifications(): NotificationRecord[] {
    return getStorage<NotificationRecord[]>("notifications", notifsState);
  },

  createNotification(notif: Omit<NotificationRecord, "id" | "createdAt" | "read" | "acknowledged" | "resolved">): NotificationRecord {
    const list = this.getNotifications();
    const id = `notif-${Date.now().toString().slice(-4)}`;
    const record: NotificationRecord = {
      ...notif,
      id,
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      read: false,
      acknowledged: false,
      resolved: false
    };

    list.unshift(record);
    notifsState = list;
    setStorage("notifications", list);
    return record;
  },

  acknowledgeNotification(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.acknowledged = true;
      item.read = true;
      notifsState = list;
      setStorage("notifications", list);
    }
  },

  resolveNotification(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.resolved = true;
      item.read = true;
      notifsState = list;
      setStorage("notifications", list);
    }
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return getStorage<AuditLogEntry[]>("audit_logs", auditState);
  },

  logAudit(entry: {
    actorName: string;
    actorRole: UserRole | 'SYSTEM_ENGINE';
    action: string;
    targetType: AuditLogEntry['targetType'];
    targetId: string;
    details: string;
  }): AuditLogEntry {
    const logs = this.getAuditLogs();
    const id = `aud-${Date.now().toString().slice(-4)}`;
    const fullEntry: AuditLogEntry = {
      ...entry,
      id,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST",
      ipAddress: "14.139.111.4 (AICTE Network)",
      verifiedHash: `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
    };

    logs.unshift(fullEntry);
    auditState = logs;
    setStorage("audit_logs", logs);
    return fullEntry;
  },

  // Overlap Centre
  getOverlaps(filter?: { status?: string }): OverlapRecord[] {
    const overlaps = getStorage<OverlapRecord[]>("overlaps", overlapsState);
    if (!filter || !filter.status || filter.status === "All") return overlaps;
    return overlaps.filter(o => o.status === filter.status);
  },

  confirmOverlap(id: string, remarks: string, reviewerName: string): OverlapRecord | null {
    const overlaps = this.getOverlaps();
    const idx = overlaps.findIndex(o => o.id === id);
    if (idx === -1) return null;

    const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
    overlaps[idx] = {
      ...overlaps[idx],
      status: "CONFIRMED_OVERLAP",
      reviewedBy: reviewerName,
      reviewedAt: nowStr,
      reviewRemarks: remarks
    };

    overlapsState = overlaps;
    setStorage("overlaps", overlaps);

    this.logAudit({
      actorName: reviewerName,
      actorRole: this.getCurrentRole(),
      action: "OVERLAP_CONFIRMED",
      targetType: "APPLICATION",
      targetId: overlaps[idx].primaryApplicationId || overlaps[idx].primaryInstitutionId,
      details: `Confirmed overlap [${overlaps[idx].type}]: ${overlaps[idx].matchedField} matches ${overlaps[idx].targetInstitutionName}. Remarks: ${remarks}`
    });

    return overlaps[idx];
  },

  dismissOverlap(id: string, remarks: string, reviewerName: string): OverlapRecord | null {
    const overlaps = this.getOverlaps();
    const idx = overlaps.findIndex(o => o.id === id);
    if (idx === -1) return null;

    const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
    overlaps[idx] = {
      ...overlaps[idx],
      status: "DISMISSED",
      reviewedBy: reviewerName,
      reviewedAt: nowStr,
      reviewRemarks: remarks
    };

    overlapsState = overlaps;
    setStorage("overlaps", overlaps);

    this.logAudit({
      actorName: reviewerName,
      actorRole: this.getCurrentRole(),
      action: "OVERLAP_DISMISSED",
      targetType: "APPLICATION",
      targetId: overlaps[idx].primaryApplicationId || overlaps[idx].primaryInstitutionId,
      details: `Dismissed overlap [${overlaps[idx].type}]. Remarks: ${remarks}`
    });

    return overlaps[idx];
  },

  // Next Best Action Engine
  getNextBestActions(currentRole: UserRole): NextBestActionItem[] {
    const apps = this.getApplications();
    const actions: NextBestActionItem[] = [];

    for (const app of apps) {
      if (app.status === "Approved" || app.status === "Rejected") continue;

      let suggestedAction = "";
      let actionCtaLabel = "View Application";
      let ruleCitation = "AICTE Approval Process Handbook (APH) 2026";
      let responsibleRole: UserRole = "SCRUTINY_OFFICER";
      let waitingReason = "";

      if (app.currentStage === "Scrutiny") {
        responsibleRole = "SCRUTINY_OFFICER";
        if (app.status === "Resubmitted") {
          suggestedAction = "Verify resubmitted compliance evidence & verify Fire Safety NOC re-upload.";
          actionCtaLabel = "Review Resubmitted Docs";
          waitingReason = "Waiting for scrutiny committee to clear resubmitted compliance evidence.";
          ruleCitation = "APH 2026 Cl. 4.2(d) — Resubmission Scrutiny Window";
        } else {
          suggestedAction = "Perform documentary verification of land deed, fire NOC and trust deed against norms.";
          actionCtaLabel = "Conduct Scrutiny";
          waitingReason = "Awaiting scrutiny committee observation upload before statutory deadline.";
          ruleCitation = "APH 2026 Cl. 4.1 — Mandatory Scrutiny Verification";
        }
      } else if (app.currentStage === "Deficiencies") {
        responsibleRole = "INSTITUTION_ADMIN";
        suggestedAction = "Upload corrected land lease renewal deed & missing municipal occupancy certificate.";
        actionCtaLabel = "Upload Corrections";
        waitingReason = "Awaiting institution to upload rectified records before 15-day deficiency timer lapses.";
        ruleCitation = "APH 2026 Cl. 4.5 — 15-Day Correction Cure Period";
      } else if (app.currentStage === "EVC Scheduling") {
        responsibleRole = "EVC_COORDINATOR";
        suggestedAction = "Empanel 3-member Expert Committee from approved academic database and fix inspection date.";
        actionCtaLabel = "Schedule EVC Committee";
        waitingReason = "Waiting for committee composition and date confirmation with regional office.";
        ruleCitation = "APH 2026 Cl. 5.1 — Expert Visiting Committee Norms";
      } else if (app.currentStage === "EVC Inspection") {
        responsibleRole = "EVC_COORDINATOR";
        suggestedAction = "Conduct geo-tagged on-site verification of laboratories, library volume, and faculty records.";
        actionCtaLabel = "Submit EVC Report";
        waitingReason = "Inspection pending or report compilation in progress.";
        ruleCitation = "APH 2026 Cl. 5.3 — Geo-Tagged On-Site Audit";
      } else if (app.currentStage === "SAC/SHC Review") {
        responsibleRole = "BUREAU_OFFICER";
        suggestedAction = "Convene Standing Appellate Committee to review contested deficiency observations.";
        actionCtaLabel = "Record SAC Decision";
        waitingReason = "Waiting for Appellate hearing date and institutional presentation.";
        ruleCitation = "APH 2026 Cl. 6.2 — Standing Appellate Committee";
      }

      actions.push({
        applicationId: app.applicationNumber,
        institutionName: app.institutionName,
        stage: app.currentStage,
        status: app.status,
        responsibleOfficer: app.assignedOfficerName,
        responsibleRole,
        outstandingAction: app.recommendedAction,
        waitingReason,
        deadline: app.deadline,
        daysRemaining: app.daysRemaining,
        riskLevel: app.riskLevel,
        prerequisites: app.deficiencies.length > 0 ? app.deficiencies : ["Document upload complete", "Payment acknowledged"],
        suggestedAction,
        actionCtaLabel,
        ruleCitation,
        isActionableByCurrentRole: currentRole === "SUPER_ADMIN" || currentRole === responsibleRole,
        linkHref: `/applications/${app.id}`
      });
    }

    return actions;
  },

  // Reset to initial demo state
  resetToDefaultDemo(): void {
    if (typeof window !== "undefined") {
      Object.keys(localStorage)
        .filter(k => k.startsWith(STORAGE_KEY_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    }
    appsState = [...INITIAL_APPLICATIONS];
    docsState = [...INITIAL_DOCUMENTS];
    instState = [...INITIAL_INSTITUTIONS];
    evcState = [...INITIAL_EVC_EVENTS];
    undertakingsState = [...INITIAL_UNDERTAKINGS];
    notifsState = [...INITIAL_NOTIFICATIONS];
    auditState = [...INITIAL_AUDIT_LOGS];
    overlapsState = [...INITIAL_OVERLAPS];
  }
};
