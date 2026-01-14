import React, { useState, useMemo } from 'react';
import { BU_DISPLAY_NAMES } from '@/constants/buNames';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    AlertCircle,
    CheckCircle2,
    Wallet,
    BarChart3,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    getManagementData,
    Granularity,
    Scope,
    KPIMetric
} from '@/data/managementOverviewData';
import { businessUnits } from '@/data/mockData';
import { BizziAIChatbot } from '@/components/BizziAIChatbot';

export function ManagementOverview() {
    const [granularity, setGranularity] = useState<Granularity>('Month');
    const [period, setPeriod] = useState('January');
    const [scope, setScope] = useState<Scope>('Group');
    const [selectedBU, setSelectedBU] = useState('bu-1');

    // Dynamic period options based on granularity
    const periodOptions = useMemo(() => {
        if (granularity === 'Month') {
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        } else if (granularity === 'Quarter') {
            return ['Q1', 'Q2', 'Q3', 'Q4'];
        } else {
            return ['2023', '2024', '2025'];
        }
    }, [granularity]);

    // Adjust period if it's not valid for current granularity
    React.useEffect(() => {
        if (!periodOptions.includes(period)) {
            setPeriod(periodOptions[0]);
        }
    }, [granularity, periodOptions, period]);

    const data = useMemo(() => {
        return getManagementData(scope, granularity, period, scope === 'BU' ? selectedBU : 'all');
    }, [scope, granularity, period, selectedBU]);

    const formatCurrency = (val: number) => {
        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
        return `$${val}`;
    };

    const KPICard = ({ title, metric, icon: Icon }: { title: string, metric: KPIMetric, icon: any }) => (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Icon className="h-5 w-5" />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                    metric.status === 'positive' ? "bg-green-50 text-green-700" :
                        metric.status === 'negative' ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-700"
                )}>
                    {metric.status === 'positive' ? <TrendingUp className="h-3 w-3" /> :
                        metric.status === 'negative' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {Math.abs(metric.vsYoY)}% YoY
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(metric.value)}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">vs Budget</span>
                <span className={cn(
                    "text-xs font-bold",
                    metric.vsBudget >= 0 ? "text-green-600" : "text-red-600"
                )}>
                    {metric.vsBudget >= 0 ? '+' : ''}{metric.vsBudget}%
                </span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Global Controls */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col lg:flex-row items-end gap-6">
                <div className="space-y-2 w-full lg:w-auto">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Granularity</label>
                    <div className="flex p-1 bg-muted rounded-lg w-full lg:w-auto">
                        {['Month', 'Quarter', 'Year'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g as Granularity)}
                                className={cn(
                                    "flex-1 lg:w-28 px-4 py-2 text-sm font-bold transition-all rounded-md",
                                    granularity === g
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                )}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 w-full lg:w-48">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Period</label>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-11 border-border bg-background shadow-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {periodOptions.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 w-full lg:w-48">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Scope</label>
                    <Select value={scope} onValueChange={(v: Scope) => setScope(v)}>
                        <SelectTrigger className="h-11 border-border bg-background shadow-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Group">Group Consolidated</SelectItem>
                            <SelectItem value="BU">Business Unit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {scope === 'BU' && (
                    <div className="space-y-2 w-full lg:w-64 animate-in slide-in-from-left-4 duration-300">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Business Unit</label>
                        <Select value={selectedBU} onValueChange={setSelectedBU}>
                            <SelectTrigger className="h-11 border-border bg-background shadow-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {businessUnits.map(bu => (
                                    <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Section 1: Executive Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                <KPICard title="Revenue" metric={data.snapshot.revenue} icon={BarChart3} />
                <KPICard title="EBITDA" metric={data.snapshot.ebitda} icon={Activity} />
                <KPICard title="Net Profit" metric={data.snapshot.netProfit} icon={TrendingUp} />
                <KPICard title="Cash" metric={data.snapshot.cash} icon={Wallet} />
                <KPICard title="Net Debt" metric={data.snapshot.netDebt} icon={Minus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Section 2: Performance vs Plan */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Performance vs Plan</h3>
                            <p className="text-sm text-muted-foreground">Actual vs Budget vs Forecast trend</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase">
                            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-primary"></div> Actual</div>
                            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-blue-400"></div> Budget</div>
                            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div> Forecast</div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.performanceVsPlan}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="period"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    tickFormatter={(val) => `$${val}M`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(val: number) => [`$${val}M`, '']}
                                />
                                <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                <Line type="monotone" dataKey="budget" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="forecast" stroke="#94A3B8" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Section 3: BU / Segment Contribution */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold">{scope === 'Group' ? 'BU Contribution' : 'Trend Analysis'}</h3>
                        <p className="text-sm text-muted-foreground">
                            {scope === 'Group' ? 'Performance by business unit' : 'Weekly performance distribution'}
                        </p>
                    </div>
                    <div className="flex-1 space-y-4">
                        {data.buContribution.map((item, idx) => (
                            <div key={idx} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-bold">{item.buName}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-heavy">{formatCurrency(item.value)}</span>
                                    <div className={cn(
                                        "flex items-center text-[10px] font-bold uppercase",
                                        item.status === 'positive' ? "text-green-600" :
                                            item.status === 'negative' ? "text-red-600" : "text-gray-500"
                                    )}>
                                        {item.change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                        {Math.abs(item.change)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Top Performer:
                            </span>
                            <span className="font-bold text-green-600">{BU_DISPLAY_NAMES.AUTO}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Watch Risk:
                            </span>
                            <span className="font-bold text-amber-600">{BU_DISPLAY_NAMES.BOT}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 4: Cash & Liquidity */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Cash & Liquidity</h3>
                            <p className="text-sm text-muted-foreground">Treasury and leverage metrics</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cash Balance</p>
                            <p className="text-xl font-bold">{formatCurrency(data.liquidity.cashBalance)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Operating CF</p>
                            <p className="text-xl font-bold">{formatCurrency(data.liquidity.operatingCashFlow)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Net Debt / EBITDA</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-bold">{data.liquidity.netDebtEbitda.toFixed(2)}x</p>
                                {data.liquidity.netDebtEbitda > data.liquidity.thresholds.netDebtEbitda && (
                                    <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                            <span className="text-muted-foreground">Leverage Capacity</span>
                            <span>{((data.liquidity.netDebtEbitda / data.liquidity.thresholds.netDebtEbitda) * 100).toFixed(0)}% used</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000",
                                    data.liquidity.netDebtEbitda > data.liquidity.thresholds.netDebtEbitda ? "bg-red-500" :
                                        data.liquidity.netDebtEbitda > 2.5 ? "bg-amber-500" : "bg-green-500"
                                )}
                                style={{ width: `${Math.min((data.liquidity.netDebtEbitda / data.liquidity.thresholds.netDebtEbitda) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">Threshold limit: {data.liquidity.thresholds.netDebtEbitda}x EBITDA</p>
                    </div>
                </div>

                {/* Section 5: Key Risks & Alerts */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm bg-slate-50/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Key Risks & Alerts</h3>
                            <p className="text-sm text-muted-foreground">Automated variance analysis and flags</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {data.alerts.map((alert, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-border rounded-lg shadow-sm">
                                <div className={cn(
                                    "mt-0.5 h-2 w-2 rounded-full shrink-0",
                                    alert.includes('Variance') || alert.includes('negative') ? "bg-red-500" : "bg-blue-500"
                                )}></div>
                                <p className="text-sm font-medium leading-relaxed">{alert}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contextual Assistant */}
            <BizziAIChatbot context="management" />
        </div>
    );
}
