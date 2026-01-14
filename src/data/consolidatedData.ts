import { ConsolidatedReport } from '@/types/finance';

export const consolidatedReports: ConsolidatedReport[] = [
    // 2025
    { id: 'cr-25-fy', period: 'FY-2025', year: 2025, type: 'Yearly', status: 'in-progress-epm', closingDate: '2026-01-20', finalApprovalDate: null, excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-25-q1', period: 'Q1-2025', year: 2025, type: 'Quarterly', status: 'closed', closingDate: '2025-04-10', finalApprovalDate: '2025-04-12', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-25-q2', period: 'Q2-2025', year: 2025, type: 'Quarterly', status: 'closed', closingDate: '2025-07-10', finalApprovalDate: '2025-07-15', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-25-q3', period: 'Q3-2025', year: 2025, type: 'Quarterly', status: 'completed', closingDate: '2025-10-10', finalApprovalDate: null, excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-25-q4', period: 'Q4-2025', year: 2025, type: 'Quarterly', status: 'in-progress-epm', closingDate: '2026-01-10', finalApprovalDate: null, excelUrl: '#', pdfUrl: '#' },

    // 2024
    { id: 'cr-24-fy', period: 'FY-2024', year: 2024, type: 'Yearly', status: 'closed', closingDate: '2025-01-20', finalApprovalDate: '2025-01-25', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-24-q1', period: 'Q1-2024', year: 2024, type: 'Quarterly', status: 'closed', closingDate: '2024-04-10', finalApprovalDate: '2024-04-12', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-24-q2', period: 'Q2-2024', year: 2024, type: 'Quarterly', status: 'closed', closingDate: '2024-07-10', finalApprovalDate: '2024-07-15', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-24-q3', period: 'Q3-2024', year: 2024, type: 'Quarterly', status: 'closed', closingDate: '2024-10-10', finalApprovalDate: '2024-10-15', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-24-q4', period: 'Q4-2024', year: 2024, type: 'Quarterly', status: 'closed', closingDate: '2025-01-10', finalApprovalDate: '2025-01-15', excelUrl: '#', pdfUrl: '#' },

    // 2023
    { id: 'cr-23-fy', period: 'FY-2023', year: 2023, type: 'Yearly', status: 'closed', closingDate: '2024-01-20', finalApprovalDate: '2024-01-25', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-23-q1', period: 'Q1-2023', year: 2023, type: 'Quarterly', status: 'closed', closingDate: '2023-04-10', finalApprovalDate: '2023-04-12', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-23-q2', period: 'Q2-2023', year: 2023, type: 'Quarterly', status: 'closed', closingDate: '2023-07-10', finalApprovalDate: '2023-07-15', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-23-q3', period: 'Q3-2023', year: 2023, type: 'Quarterly', status: 'closed', closingDate: '2023-10-10', finalApprovalDate: '2023-10-15', excelUrl: '#', pdfUrl: '#' },
    { id: 'cr-23-q4', period: 'Q4-2023', year: 2023, type: 'Quarterly', status: 'closed', closingDate: '2024-01-10', finalApprovalDate: '2024-01-15', excelUrl: '#', pdfUrl: '#' },
];
