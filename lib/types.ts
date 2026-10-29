export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'BUREAU_OFFICER' 
  | 'REGIONAL_OFFICER' 
  | 'SCRUTINY_OFFICER' 
  | 'EVC_COORDINATOR' 
  | 'INSTITUTION_ADMIN' 
  | 'READONLY_AUDITOR';

export type Region = 
  | 'Northern' 
  | 'Western' 
  | 'Southern' 
  | 'Eastern' 
  | 'Central' 
  | 'South-Western' 
  | 'North-Western';

export type ApplicationStage = 
  | 'Submission' 
  | 'Scrutiny' 
  | 'Deficiencies' 
  | 'EVC Scheduling' 
  | 'EVC Inspection' 
  | 'SAC/SHC Review' 
  | 'Final Approval';

export type ApplicationStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Scrutiny' 
  | 'Deficiencies Raised' 
  | 'Resubmitted' 
  | 'Awaiting EVC' 
  | 'EVC Completed' 
  | 'SAC Hearing' 
  | 'Approved' 
  | 'Rejected';

export type RiskLevel = 'Normal' | 'Attention Required' | 'High Risk' | 'Overdue';

export type WorkflowRoute = 
  | 'Standard (Scrutiny + EVC + SAC)' 
  | 'Only Scrutiny (Extension of Approval - EoA)' 
  | 'Only EVC (Special Inspection)' 
  | 'EVC + SAC/SHC';

export type DocumentCategory = 
  | 'Land Lease / Ownership Deed' 
  | 'AICTE Trust / Society Registration' 
  | 'Building Plan & Occupancy Certificate' 
  | 'Fire Safety NOC' 
  | 'State Govt / Affiliating University NOC' 
  | 'Structural Stability & Barrier-Free Certificate' 
  | 'Faculty Cadre & AICTE Pay Scale Undertaking';

export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'RETURNED' | 'REJECTED';

export interface Institution {
  id: string;
  permanentId: string;
  name: string;
  region: Region;
  address: string;
  category: 'Engineering & Technology' | 'Management' | 'Pharmacy' | 'Architecture' | 'Polytechnic';
  establishedYear: number;
  authorizedAdminName: string;
  authorizedAdminEmail: string;
  contactPhone: string;
  complianceScore: number;
  status: 'Compliant' | 'Deficiencies Outstanding' | 'Under Review' | 'High Risk Alert';
  landAreaAcres: number;
  totalFaculty: number;
  approvedIntake: number;
}

export interface Application {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  region: Region;
  category: string;
  academicYear: string;
  workflowTemplate: WorkflowRoute;
  currentStage: ApplicationStage;
  status: ApplicationStatus;
  assignedOfficerName: string;
  assignedOfficerRole: UserRole;
  submissionDate: string;
  deadline: string;
  lastActionDate: string;
  daysRemaining: number;
  riskLevel: RiskLevel;
  riskReason: string;
  recommendedAction: string;
  deficiencies: string[];
  prerequisitesMet: boolean;
  blockingReason?: string;
  version: string;
}

export interface DocumentRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  applicationId: string;
  category: DocumentCategory;
  title: string;
  fileName: string;
  fileSize: string;
  fileHash: string;
  uploadDate: string;
  issueDate?: string;
  expiryDate?: string;
  daysToExpiry?: number;
  isExpiringSoon: boolean;
  isExpired: boolean;
  extractedMetadata: {
    deedRegistrationNo?: string;
    surveyPlotNo?: string;
    areaAcres?: number;
    issuingAuthority?: string;
    validUntil?: string;
    stampDutyPaid?: string;
    notarized?: boolean;
    confidenceScore?: number;
  };
  ocrFlags: string[];
  verificationStatus: DocumentVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationRemarks?: string;
  versionNumber: number;
}

export interface EVCEvent {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  region: Region;
  scheduledDate: string;
  status: 'Awaiting Schedule' | 'Scheduled' | 'Inspection Completed' | 'Report Submitted' | 'Report Approved';
  committeeMembers: string[];
  leadAuditor: string;
  inspectionMode: 'Physical On-Site' | 'Hybrid Geo-Tagged' | 'Virtual Evidence';
  geotagVerified: boolean;
  deficienciesNoted: string[];
  reportSummary?: string;
  assignedDate: string;
}

export interface Undertaking {
  id: string;
  institutionId: string;
  institutionName: string;
  applicationId: string;
  title: string;
  clause: string;
  issuedDate: string;
  deadline: string;
  daysRemaining: number;
  status: 'Pending Submission' | 'Under Verification' | 'Complied' | 'Overdue';
  penaltyClause: string;
  submittedDocumentId?: string;
  resolvedAt?: string;
}

export interface NotificationRecord {
  id: string;
  type: 'DEADLINE_APPROACHING' | 'STAGE_OVERDUE' | 'DOCUMENT_EXPIRING' | 'DEFICIENCY_ISSUED' | 'EVC_SCHEDULED' | 'ESCALATION';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recipientRole: UserRole | 'ALL';
  recipientName: string;
  institutionId?: string;
  applicationId?: string;
  createdAt: string;
  read: boolean;
  acknowledged: boolean;
  resolved: boolean;
  escalatedTo?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'SYSTEM_ENGINE';
  action: string;
  targetType: 'APPLICATION' | 'DOCUMENT' | 'EVC' | 'UNDERTAKING' | 'NOTIFICATION' | 'WORKFLOW';
  targetId: string;
  details: string;
  ipAddress: string;
  verifiedHash: string;
}

export interface NextBestActionItem {
  applicationId: string;
  institutionName: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  responsibleOfficer: string;
  responsibleRole: UserRole;
  outstandingAction: string;
  waitingReason: string;
  deadline: string;
  daysRemaining: number;
  riskLevel: RiskLevel;
  prerequisites: string[];
  suggestedAction: string;
  actionCtaLabel: string;
  ruleCitation: string;
  isActionableByCurrentRole: boolean;
  linkHref: string;
}

export interface OverlapRecord {
  id: string;
  type: 'DUPLICATE_FILE_HASH' | 'LAND_PLOT_COLLISION' | 'FACULTY_ID_DUPLICATION' | 'CASE_REFERENCE_OVERLAP';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  primaryInstitutionId: string;
  primaryInstitutionName: string;
  primaryApplicationId?: string;
  targetInstitutionId: string;
  targetInstitutionName: string;
  targetApplicationId?: string;
  matchedField: string;
  matchedValue: string;
  confidenceScore: number;
  detectedAt: string;
  status: 'UNREVIEWED' | 'CONFIRMED_OVERLAP' | 'DISMISSED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

