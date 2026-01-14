export interface BUTask {
    name: string;
    owner: string;
    status: 'Open' | 'Sent' | 'Reject' | 'Approve' | 'In Progress';
    dueDate: string;
    sla: number;
    reason?: string;
}

export const BU_TASKS_DATA: BUTask[] = [
    { "name": "Trial Balance", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-12", "sla": 2 },
    {
        "name": "Statutory Financial Statements",
        "owner": "Nguyen A –  Finance Manager",
        "status": "Reject",
        "dueDate": "2026-01-13",
        "sla": 3,
        "reason": "Balance Sheet does not reconcile with Trial Balance after local adjustments"
    },
    { "name": "General Ledger Detail", "owner": "Tran B –  Chief Accountant", "status": "Sent", "dueDate": "2026-01-14", "sla": 0 },
    {
        "name": "Accounts Receivable Aging",
        "owner": "Tran B –  Chief Accountant",
        "status": "Reject",
        "dueDate": "2026-01-15",
        "sla": 1,
        "reason": "Customer aging does not match closing AR balance on Trial Balance"
    },
    { "name": "Bad Debt Provision Calculation", "owner": "Tran B –  Chief Accountant", "status": "Open", "dueDate": "2026-01-15", "sla": 1 },
    { "name": "Accounts Payable Aging", "owner": "Tran B –  Chief Accountant", "status": "Open", "dueDate": "2026-01-15", "sla": 1 },
    {
        "name": "Intercompany Accounts Receivable Aging",
        "owner": "Tran B –  Chief Accountant",
        "status": "Reject",
        "dueDate": "2026-01-16",
        "sla": 0,
        "reason": "Mismatch with counterparty Intercompany Accounts Payable balance"
    },
    { "name": "Intercompany Accounts Payable Aging", "owner": "Tran B –  Chief Accountant", "status": "Sent", "dueDate": "2026-01-16", "sla": 0 },
    {
        "name": "Intercompany Reconciliation Report",
        "owner": "Nguyen A –  Finance Manager",
        "status": "Reject",
        "dueDate": "2026-01-17",
        "sla": 2,
        "reason": "Unresolved intercompany differences remain without explanation"
    },
    { "name": "Intercompany Revenue and Cost Detail", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-17", "sla": 2 },
    {
        "name": "Inventory Listing",
        "owner": "Le C –  Inventory Accountant",
        "status": "Reject",
        "dueDate": "2026-01-18",
        "sla": 1,
        "reason": "Inventory quantity differs from warehouse physical count report"
    },
    { "name": "Inventory Aging Report", "owner": "Le C –  Inventory Accountant", "status": "Open", "dueDate": "2026-01-18", "sla": 1 },
    { "name": "Inventory Provision Calculation", "owner": "Le C –  Inventory Accountant", "status": "Open", "dueDate": "2026-01-18", "sla": 1 },
    { "name": "Fixed Asset Register", "owner": "Pham D –  Fixed Asset Accountant", "status": "Sent", "dueDate": "2026-01-19", "sla": 0 },
    {
        "name": "Depreciation Schedule",
        "owner": "Pham D –  Fixed Asset Accountant",
        "status": "Reject",
        "dueDate": "2026-01-19",
        "sla": 0,
        "reason": "Depreciation expense does not align with Fixed Asset Register movement"
    },
    { "name": "Prepaid Expense Schedule", "owner": "Tran B –  Chief Accountant", "status": "Open", "dueDate": "2026-01-20", "sla": 1 },
    { "name": "Accrued Expense Schedule", "owner": "Tran B –  Chief Accountant", "status": "Open", "dueDate": "2026-01-20", "sla": 1 },
    { "name": "Cash and Bank Reconciliation", "owner": "Hoang E –  Treasury Accountant", "status": "Open", "dueDate": "2026-01-20", "sla": 0 },
    {
        "name": "Bank Balance Confirmation",
        "owner": "Hoang E –  Treasury Accountant",
        "status": "Reject",
        "dueDate": "2026-01-21",
        "sla": 0,
        "reason": "Bank confirmation not consistent with reconciled bank balance"
    },
    { "name": "Loan and Borrowing Schedule", "owner": "Nguyen A –  Finance Manager", "status": "Sent", "dueDate": "2026-01-22", "sla": 0 },
    { "name": "Interest Accrual Schedule", "owner": "Nguyen A –  Finance Manager", "status": "Sent", "dueDate": "2026-01-22", "sla": 0 },
    { "name": "Equity Movement Schedule", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-23", "sla": 1 },
    {
        "name": "Investment in Subsidiaries / Affiliates Schedule",
        "owner": "Nguyen A –  Finance Manager",
        "status": "Reject",
        "dueDate": "2026-01-23",
        "sla": 1,
        "reason": "Ownership percentage does not match group legal structure"
    },
    { "name": "Non-Controlling Interest Calculation", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-23", "sla": 1 },
    { "name": "VAT Reconciliation and VAT Return", "owner": "Vu F –  Tax Specialist", "status": "Sent", "dueDate": "2026-01-24", "sla": 0 },
    {
        "name": "Corporate Income Tax Computation",
        "owner": "Vu F –  Tax Specialist",
        "status": "Reject",
        "dueDate": "2026-01-24",
        "sla": 0,
        "reason": "Taxable income differs from accounting profit without reconciliation"
    },
    { "name": "Tax Payable / Receivable Reconciliation", "owner": "Vu F –  Tax Specialist", "status": "Open", "dueDate": "2026-01-24", "sla": 1 },
    {
        "name": "Elimination Support File – Intercompany Balances",
        "owner": "Nguyen A –  Finance Manager",
        "status": "Reject",
        "dueDate": "2026-01-25",
        "sla": 2,
        "reason": "Elimination entries not supported by intercompany reconciliation evidence"
    },
    { "name": "Elimination Support File – Intercompany Revenue and Cost", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-25", "sla": 2 },
    { "name": "Unrealized Profit in Inventory Calculation", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-25", "sla": 2 },
    { "name": "Foreign Currency Translation Schedule", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-26", "sla": 2 },
    {
        "name": "Variance Analysis and Management Commentary",
        "owner": "Nguyen A –  Finance Manager",
        "status": "Reject",
        "dueDate": "2026-01-26",
        "sla": 1,
        "reason": "Key variances are identified t lack root cause explanation"
    },
    { "name": "Management Representation Letter", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-27", "sla": 1 },
    { "name": "Subsequent Events Disclosure", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-27", "sla": 1 },
    { "name": "Commitments and Contingencies Disclosure", "owner": "Nguyen A –  Finance Manager", "status": "Open", "dueDate": "2026-01-27", "sla": 1 }
];

// In-memory persistence for the current session
let persistentTasks: BUTask[] = [...BU_TASKS_DATA];

export const getPersistentBUTasks = () => [...persistentTasks];

export const updateBUTaskStatus = (index: number, status: BUTask['status']) => {
    if (index >= 0 && index < persistentTasks.length) {
        persistentTasks[index] = { ...persistentTasks[index], status };
        return true;
    }
    return false;
};
