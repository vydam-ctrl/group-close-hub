import { BusinessUnit, BUDetails, Report, ValidationMessage, ReportStatus } from '@/types/finance';
import { BU_DISPLAY_NAMES } from '@/constants/buNames';

export const businessUnits: BusinessUnit[] = [
  {
    id: 'bu-1',
    code: 'AUTO',
    name: BU_DISPLAY_NAMES.AUTO,
    totalReports: 12,
    submittedReports: 10,
    approvedReports: 8,
    completionPercentage: 83,
    overallStatus: 'in-progress',
    region: 'Industrial',
  },
  {
    id: 'bu-2',
    code: 'BOT',
    name: BU_DISPLAY_NAMES.BOT,
    totalReports: 12,
    submittedReports: 12,
    approvedReports: 12,
    completionPercentage: 100,
    overallStatus: 'completed',
    region: 'Infrastructure',
  },
  {
    id: 'bu-3',
    code: 'LAND',
    name: BU_DISPLAY_NAMES.LAND,
    totalReports: 10,
    submittedReports: 8,
    approvedReports: 5,
    completionPercentage: 80,
    overallStatus: 'in-progress',
    region: 'Real Estate',
  },
  {
    id: 'bu-4',
    code: 'VETC',
    name: BU_DISPLAY_NAMES.VETC,
    totalReports: 10,
    submittedReports: 0,
    approvedReports: 0,
    completionPercentage: 0,
    overallStatus: 'not-started',
    region: 'Technology',
  },
  {
    id: 'bu-5',
    code: 'SAVICO',
    name: BU_DISPLAY_NAMES.SAVICO,
    totalReports: 8,
    submittedReports: 8,
    approvedReports: 6,
    completionPercentage: 100,
    overallStatus: 'completed',
    region: 'Investment',
  },
  {
    id: 'bu-6',
    code: 'DNP',
    name: BU_DISPLAY_NAMES.DNP,
    totalReports: 8,
    submittedReports: 5,
    approvedReports: 2,
    completionPercentage: 62,
    overallStatus: 'late',
    region: 'Holding',
  },
  {
    id: 'bu-7',
    code: 'NVT',
    name: BU_DISPLAY_NAMES.NVT,
    totalReports: 8,
    submittedReports: 8,
    approvedReports: 8,
    completionPercentage: 100,
    overallStatus: 'completed',
    region: 'Hospitality',
  },
  {
    id: 'bu-8',
    code: 'SERVICE',
    name: BU_DISPLAY_NAMES.SERVICE_TRADING,
    totalReports: 10,
    submittedReports: 7,
    approvedReports: 4,
    completionPercentage: 70,
    overallStatus: 'in-progress',
    region: 'Services',
  },
];

const pastBusinessUnits: BusinessUnit[] = businessUnits.map(bu => ({
  ...bu,
  totalReports: bu.totalReports,
  submittedReports: bu.totalReports,
  approvedReports: bu.totalReports,
  completionPercentage: 100,
  overallStatus: 'locked',
}));

export const getBusinessUnitsByYear = (year: number): BusinessUnit[] => {
  const currentYear = new Date().getFullYear();
  if (year < 2025) {
    return pastBusinessUnits;
  }
  return businessUnits;
};

const createReportsForBU = (buId: string): Report[] => {
  const baseReports: Omit<Report, 'id' | 'status' | 'buSubmissionDate' | 'hoReviewer' | 'hoFirstViewDate' | 'decisionDate' | 'rejectReason'>[] = [
    {
      code: 'TB-001',
      name: 'Trial Balance - December',
      type: 'TB',
      deadline: '2024-01-15',
      validationSummary: { passed: 45, failed: 0, warnings: 2 },
      metadata: { format: 'Excel', sourceSystem: 'SAP', version: '1.2' },
    },
    {
      code: 'AR-001',
      name: 'Accounts Receivable Aging',
      type: 'AR',
      deadline: '2024-01-15',
      validationSummary: { passed: 32, failed: 1, warnings: 0 },
      metadata: { format: 'Excel', sourceSystem: 'SAP', version: '1.0' },
    },
    {
      code: 'AP-001',
      name: 'Accounts Payable Aging',
      type: 'AP',
      deadline: '2024-01-15',
      validationSummary: { passed: 28, failed: 0, warnings: 1 },
      metadata: { format: 'Excel', sourceSystem: 'SAP', version: '1.0' },
    },
    {
      code: 'INV-001',
      name: 'Inventory Valuation Report',
      type: 'Inventory',
      deadline: '2024-01-16',
      validationSummary: { passed: 55, failed: 2, warnings: 3 },
      metadata: { format: 'Excel', sourceSystem: 'Oracle', version: '2.1' },
    },
    {
      code: 'FA-001',
      name: 'Fixed Assets Register',
      type: 'FA',
      deadline: '2024-01-16',
      validationSummary: { passed: 40, failed: 0, warnings: 0 },
      metadata: { format: 'PDF', sourceSystem: 'SAP', version: '1.0' },
    },
    {
      code: 'IC-001',
      name: 'Intercompany Balances',
      type: 'IC',
      deadline: '2024-01-17',
      validationSummary: { passed: 25, failed: 3, warnings: 5 },
      metadata: { format: 'Excel', sourceSystem: 'SAP', version: '1.3' },
    },
    {
      code: 'BS-001',
      name: 'Balance Sheet',
      type: 'BS',
      deadline: '2024-01-18',
      validationSummary: { passed: 60, failed: 0, warnings: 1 },
      metadata: { format: 'PDF', sourceSystem: 'SAP', version: '1.0' },
    },
    {
      code: 'PL-001',
      name: 'Profit & Loss Statement',
      type: 'PL',
      deadline: '2024-01-18',
      validationSummary: { passed: 48, failed: 0, warnings: 2 },
      metadata: { format: 'PDF', sourceSystem: 'SAP', version: '1.0' },
    },
  ];

  const statuses: Report['status'][] = ['approved', 'approved', 'in-review', 'received', 'not-sent', 'rejected', 'approved', 'received'];
  const reviewers = ['Mai Vy', 'Michael Roberts', 'Anna Schmidt', null, null, 'David Kim', 'Mai Vy', null];

  return baseReports.map((report, index) => ({
    ...report,
    id: `${buId}-${report.code}`,
    status: statuses[index % statuses.length],
    buSubmissionDate: statuses[index % statuses.length] !== 'not-sent' ? '2024-01-10' : null,
    hoReviewer: reviewers[index % reviewers.length],
    hoFirstViewDate: ['in-review', 'approved', 'rejected'].includes(statuses[index % statuses.length]) ? '2024-01-12' : null,
    decisionDate: ['approved', 'rejected'].includes(statuses[index % statuses.length]) ? '2024-01-13' : null,
    rejectReason: statuses[index % statuses.length] === 'rejected' ? 'Intercompany balances do not reconcile with counterparty. Variance of $125,000 identified.' : null,
  }));
};

// In-memory cache for reports to persist status changes during the session
const reportsCache: Record<string, Report[]> = {};

export const updateReportStatus = (
  buId: string,
  reportId: string,
  status: ReportStatus,
  decisionDate?: string | null,
  rejectReason?: string | null
) => {
  if (!reportsCache[buId]) {
    reportsCache[buId] = createReportsForBU(buId);
  }

  const report = reportsCache[buId].find(r => r.id === reportId);
  if (report) {
    report.status = status;
    if (decisionDate !== undefined) report.decisionDate = decisionDate;
    if (rejectReason !== undefined) report.rejectReason = rejectReason;
    return true;
  }
  return false;
};

export const getBUDetails = (buId: string, year: number = new Date().getFullYear()): BUDetails | null => {
  const bus = getBusinessUnitsByYear(year);
  const bu = bus.find(b => b.id === buId);
  if (!bu) return null;

  if (!reportsCache[buId]) {
    reportsCache[buId] = createReportsForBU(buId);
  }

  let reports = [...reportsCache[buId]];
  if (bu.overallStatus === 'locked') {
    reports = reports.map(r => ({ ...r, status: 'locked' as ReportStatus }));
  }

  return {
    bu,
    reportingPeriod: `Q4 ${year}`,
    overallDeadline: `${year}-01-20`,
    reports,
    summary: {
      total: reports.length,
      notSent: reports.filter(r => r.status === 'not-sent').length,
      received: reports.filter(r => r.status === 'received').length,
      inReview: reports.filter(r => r.status === 'in-review').length,
      approved: reports.filter(r => r.status === 'approved').length,
      rejected: reports.filter(r => r.status === 'rejected').length,
    },
  };
};

export const getReportById = (buId: string, reportId: string, year: number = new Date().getFullYear()): Report | null => {
  const details = getBUDetails(buId, year);
  if (!details) return null;
  return details.reports.find(r => r.id === reportId) || null;
};

export const validationMessages: ValidationMessage[] = [
  { type: 'error', code: 'VAL-001', message: 'Total debits do not equal total credits', field: 'Trial Balance' },
  { type: 'error', code: 'VAL-002', message: 'Missing cost center allocation for overhead expenses', field: 'P&L' },
  { type: 'warning', code: 'VAL-003', message: 'Unusual variance detected: Revenue increased by 45% vs prior period', field: 'Revenue' },
  { type: 'warning', code: 'VAL-004', message: 'Intercompany elimination difference of $12,500', field: 'IC Balances' },
  { type: 'info', code: 'VAL-005', message: 'Report generated from SAP ECC 6.0, last sync: 2024-01-10 14:30 UTC' },
  { type: 'info', code: 'VAL-006', message: 'Currency conversion applied using month-end rates' },
];
