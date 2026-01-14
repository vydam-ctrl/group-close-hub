export type BUOverallStatus = 'not-started' | 'in-progress' | 'completed' | 'late' | 'locked';

export type ReportStatus = 'not-sent' | 'received' | 'in-review' | 'approved' | 'rejected' | 'locked';

export type ReportType = 'TB' | 'AR' | 'AP' | 'Inventory' | 'FA' | 'IC' | 'BS' | 'PL' | 'CF';

export interface BusinessUnit {
  id: string;
  code: string;
  name: string;
  totalReports: number;
  submittedReports: number;
  approvedReports: number;
  completionPercentage: number;
  overallStatus: BUOverallStatus;
  region: string;
}

export interface Report {
  id: string;
  code: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  buSubmissionDate: string | null;
  deadline: string;
  hoReviewer: string | null;
  hoFirstViewDate: string | null;
  decisionDate: string | null;
  rejectReason: string | null;
  validationSummary: {
    passed: number;
    failed: number;
    warnings: number;
  };
  metadata: {
    format: string;
    sourceSystem: string;
    version: string;
  };
}

export interface BUDetails {
  bu: BusinessUnit;
  reportingPeriod: string;
  overallDeadline: string;
  reports: Report[];
  summary: {
    total: number;
    notSent: number;
    received: number;
    inReview: number;
    approved: number;
    rejected: number;
  };
}

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  field?: string;
}

export type ConsolidationStatus = 'in-progress-epm' | 'completed' | 'closed';
export type PeriodType = 'Monthly' | 'Quarterly' | 'Yearly' | 'Annual'; // Added Yearly, kept Annual just in case but Yearly is the focus now.

export interface ConsolidatedReport {
  id: string;
  period: string;
  year: number;
  type: PeriodType;
  status: ConsolidationStatus;
  closingDate: string;
  finalApprovalDate: string | null;
  excelUrl: string;
  pdfUrl: string;
}
