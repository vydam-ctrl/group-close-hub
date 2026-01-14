export type Granularity = 'Month' | 'Quarter' | 'Year';
export type Scope = 'Group' | 'BU';

export interface KPIMetric {
    value: number;
    vsBudget: number; // percentage
    vsYoY: number; // percentage
    status: 'positive' | 'negative' | 'neutral';
}

export interface ExecutiveSnapshot {
    revenue: KPIMetric;
    ebitda: KPIMetric;
    netProfit: KPIMetric;
    cash: KPIMetric;
    netDebt: KPIMetric;
}

export interface ChartDataPoint {
    period: string;
    actual: number;
    budget: number;
    forecast: number;
}

export interface BUContribution {
    buName: string;
    value: number;
    change: number;
    status: 'positive' | 'negative' | 'neutral';
}

export interface ManagementData {
    snapshot: ExecutiveSnapshot;
    performanceVsPlan: ChartDataPoint[];
    buContribution: BUContribution[];
    liquidity: {
        cashBalance: number;
        operatingCashFlow: number;
        netDebtEbitda: number;
        thresholds: {
            netDebtEbitda: number;
        };
    };
    alerts: string[];
}

import { BU_DISPLAY_NAMES } from '@/constants/buNames';

export const managementMockData: Record<string, ManagementData> = {
    // Key format: scope_granularity_period_buId
    "Group_Month_January_all": {
        snapshot: {
            revenue: { value: 452000000, vsBudget: 4.2, vsYoY: 8.5, status: 'positive' },
            ebitda: { value: 85400000, vsBudget: -1.5, vsYoY: 12.1, status: 'positive' },
            netProfit: { value: 42300000, vsBudget: 2.1, vsYoY: 5.4, status: 'positive' },
            cash: { value: 125000000, vsBudget: 10.5, vsYoY: -2.1, status: 'neutral' },
            netDebt: { value: 210000000, vsBudget: -5.2, vsYoY: -8.4, status: 'positive' }, // lower is positive for debt
        },
        performanceVsPlan: [
            { period: 'Aug', actual: 410, budget: 400, forecast: 405 },
            { period: 'Sep', actual: 425, budget: 410, forecast: 415 },
            { period: 'Oct', actual: 430, budget: 420, forecast: 425 },
            { period: 'Nov', actual: 445, budget: 430, forecast: 440 },
            { period: 'Dec', actual: 460, budget: 450, forecast: 455 },
            { period: 'Jan', actual: 452, budget: 435, forecast: 445 },
        ],
        buContribution: [
            { buName: BU_DISPLAY_NAMES.AUTO, value: 154000000, change: 12.4, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.BOT, value: 122000000, change: -2.1, status: 'negative' },
            { buName: BU_DISPLAY_NAMES.LAND, value: 98000000, change: 15.2, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.VETC, value: 45000000, change: 5.4, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.SAVICO, value: 33000000, change: 0.5, status: 'neutral' },
        ],
        liquidity: {
            cashBalance: 125000000,
            operatingCashFlow: 15200000,
            netDebtEbitda: 2.45,
            thresholds: {
                netDebtEbitda: 3.0,
            }
        },
        alerts: [
            `Variance in ${BU_DISPLAY_NAMES.BOT} Revenue exceeds 5% threshold`,
            `${BU_DISPLAY_NAMES.LAND} EBITDA showing strong YoY growth (+15.2%)`,
            "Net Debt/EBITDA remains healthy at 2.45x"
        ]
    },
    "BU_Month_January_bu-1": {
        snapshot: {
            revenue: { value: 154000000, vsBudget: 12.4, vsYoY: 15.2, status: 'positive' },
            ebitda: { value: 32400000, vsBudget: 8.1, vsYoY: 10.5, status: 'positive' },
            netProfit: { value: 18200000, vsBudget: 5.4, vsYoY: 7.2, status: 'positive' },
            cash: { value: 45000000, vsBudget: 2.1, vsYoY: -1.5, status: 'neutral' },
            netDebt: { value: 65000000, vsBudget: -2.4, vsYoY: -4.1, status: 'positive' },
        },
        performanceVsPlan: [
            { period: 'Aug', actual: 120, budget: 115, forecast: 118 },
            { period: 'Sep', actual: 125, budget: 120, forecast: 122 },
            { period: 'Oct', actual: 130, budget: 125, forecast: 128 },
            { period: 'Nov', actual: 140, budget: 135, forecast: 138 },
            { period: 'Dec', actual: 145, budget: 140, forecast: 142 },
            { period: 'Jan', actual: 154, budget: 137, forecast: 145 },
        ],
        buContribution: [
            { buName: 'Jan (Week 1)', value: 35000000, change: 5.2, status: 'positive' },
            { buName: 'Jan (Week 2)', value: 38000000, change: 8.1, status: 'positive' },
            { buName: 'Jan (Week 3)', value: 41000000, change: 4.3, status: 'positive' },
            { buName: 'Jan (Week 4)', value: 40000000, change: -2.1, status: 'negative' },
        ],
        liquidity: {
            cashBalance: 45000000,
            operatingCashFlow: 4200000,
            netDebtEbitda: 2.0,
            thresholds: {
                netDebtEbitda: 3.5,
            }
        },
        alerts: [
            "Revenue target exceeded by 12.4%",
            "Operating Cash Flow remains positive",
        ]
    },
    // Adding a few more for variety
    "Group_Quarter_Q1_all": {
        snapshot: {
            revenue: { value: 1350000000, vsBudget: 2.5, vsYoY: 6.1, status: 'positive' },
            ebitda: { value: 245000000, vsBudget: 1.2, vsYoY: 10.4, status: 'positive' },
            netProfit: { value: 125000000, vsBudget: -0.5, vsYoY: 4.2, status: 'neutral' },
            cash: { value: 132000000, vsBudget: 5.4, vsYoY: 1.2, status: 'positive' },
            netDebt: { value: 205000000, vsBudget: -2.1, vsYoY: -5.4, status: 'positive' },
        },
        performanceVsPlan: [
            { period: 'Q4-23', actual: 1250, budget: 1200, forecast: 1230 },
            { period: 'Q1-24', actual: 1350, budget: 1315, forecast: 1340 },
        ],
        buContribution: [
            { buName: BU_DISPLAY_NAMES.AUTO, value: 450000000, change: 8.2, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.BOT, value: 380000000, change: 1.4, status: 'neutral' },
            { buName: BU_DISPLAY_NAMES.LAND, value: 290000000, change: 12.5, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.VETC, value: 130000000, change: 5.1, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.SAVICO, value: 100000000, change: -2.4, status: 'negative' },
        ],
        liquidity: {
            cashBalance: 132000000,
            operatingCashFlow: 35000000,
            netDebtEbitda: 2.3,
            thresholds: {
                netDebtEbitda: 3.0,
            }
        },
        alerts: [
            "Q1 performance consistent with annual targets",
            "Strong growth in APAC region",
        ]
    },
    "Group_Year_2024_all": {
        snapshot: {
            revenue: { value: 5240000000, vsBudget: 5.4, vsYoY: 12.5, status: 'positive' },
            ebitda: { value: 985000000, vsBudget: 4.1, vsYoY: 15.2, status: 'positive' },
            netProfit: { value: 512000000, vsBudget: 3.2, vsYoY: 8.4, status: 'positive' },
            cash: { value: 145000000, vsBudget: 12.4, vsYoY: 5.1, status: 'positive' },
            netDebt: { value: 195000000, vsBudget: -8.5, vsYoY: -12.4, status: 'positive' },
        },
        performanceVsPlan: [
            { period: '2021', actual: 4200, budget: 4100, forecast: 4150 },
            { period: '2022', actual: 4600, budget: 4500, forecast: 4550 },
            { period: '2023', actual: 5100, budget: 5000, forecast: 5050 },
            { period: '2024', actual: 5240, budget: 4970, forecast: 5100 },
        ],
        buContribution: [
            { buName: BU_DISPLAY_NAMES.AUTO, value: 1850000000, change: 15.2, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.BOT, value: 1420000000, change: 5.4, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.LAND, value: 1150000000, change: 20.1, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.VETC, value: 510000000, change: 8.4, status: 'positive' },
            { buName: BU_DISPLAY_NAMES.SAVICO, value: 310000000, change: 2.1, status: 'neutral' },
        ],
        liquidity: {
            cashBalance: 145000000,
            operatingCashFlow: 125000000,
            netDebtEbitda: 2.1,
            thresholds: {
                netDebtEbitda: 3.0,
            }
        },
        alerts: [
            "Record revenue and EBITDA achieved in FY2024",
            "Net Debt reduced significantly through strong cash management",
        ]
    }
};

export const getManagementData = (scope: Scope, granularity: Granularity, period: string, buId: string = 'all'): ManagementData => {
    const key = `${scope}_${granularity}_${period}_${buId}`;
    return managementMockData[key] || managementMockData["Group_Month_January_all"];
};
