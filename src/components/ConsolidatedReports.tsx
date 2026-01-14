import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { consolidatedReports } from '@/data/consolidatedData';
import { ConsolidationStatus, PeriodType, ConsolidatedReport } from '@/types/finance';
import {
    FileSpreadsheet,
    FileText,
    Lock,
    Search,
    Filter,
    Download,
    Eye,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BizziAIChatbot } from '@/components/BizziAIChatbot';

export function ConsolidatedReports() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<PeriodType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<ConsolidationStatus | 'all'>('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

    const toggleYear = (year: number) => {
        setExpandedYears(prev => ({
            ...prev,
            [year]: !prev[year]
        }));
    };

    const groupedData = useMemo(() => {
        // Initial filtering
        const filtered = consolidatedReports.filter(report => {
            const matchSearch = report.period.toLowerCase().includes(searchTerm.toLowerCase());
            const matchType = typeFilter === 'all' || report.type === typeFilter;
            const matchStatus = statusFilter === 'all' || report.status === statusFilter;
            const matchYear = selectedYear === 'all' || report.year.toString() === selectedYear;

            return matchSearch && matchType && matchStatus && matchYear;
        });

        // Grouping by Year
        const groups: Record<number, { yearly: ConsolidatedReport | null, quarters: ConsolidatedReport[] }> = {};

        // Populate groups with all reports
        consolidatedReports.forEach(report => {
            if (!groups[report.year]) {
                groups[report.year] = { yearly: null, quarters: [] };
            }
            if (report.type === 'Yearly') {
                groups[report.year].yearly = report;
            } else {
                groups[report.year].quarters.push(report);
            }
        });

        // Apply filters to determine which groups to show and which children to show
        return Object.entries(groups)
            .map(([yearStr, data]) => {
                const year = parseInt(yearStr);

                // A group is visible if its Yearly record matches filters OR any of its children match
                const yearlyMatches = data.yearly && (
                    data.yearly.period.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (typeFilter === 'all' || typeFilter === 'Yearly') &&
                    (statusFilter === 'all' || data.yearly.status === statusFilter) &&
                    (selectedYear === 'all' || data.yearly.year.toString() === selectedYear)
                );

                const filteredChildren = data.quarters.filter(q => {
                    const matchSearch = q.period.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchType = typeFilter === 'all' || q.type === typeFilter;
                    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
                    const matchYear = selectedYear === 'all' || q.year.toString() === selectedYear;
                    return matchSearch && matchType && matchStatus && matchYear;
                });

                if (yearlyMatches || filteredChildren.length > 0) {
                    return {
                        year,
                        parent: data.yearly,
                        children: filteredChildren
                    };
                }
                return null;
            })
            .filter((group): group is { year: number, parent: ConsolidatedReport | null, children: ConsolidatedReport[] } => group !== null)
            .sort((a, b) => b.year - a.year);
    }, [searchTerm, typeFilter, statusFilter, selectedYear]);

    const ActionButtons = ({ report, isExpandedMode = false }: { report: ConsolidatedReport, isExpandedMode?: boolean }) => (
        <div className={cn("flex items-center gap-2", isExpandedMode ? "justify-center" : "justify-center")}>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-8 px-2 gap-2 flex items-center transition-all",
                    report.status === 'in-progress-epm' ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-50 hover:text-blue-700"
                )}
                disabled={report.status === 'in-progress-epm'}
                onClick={(e) => {
                    e.stopPropagation();
                    toast.info(`Previewing ${report.type} consolidated report for ${report.period}...`);
                }}
            >
                <Eye className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Preview</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-8 px-2 gap-2 flex items-center transition-all",
                    report.status === 'in-progress-epm' ? "opacity-30 cursor-not-allowed" : "hover:bg-green-50 hover:text-green-700"
                )}
                disabled={report.status === 'in-progress-epm'}
                onClick={(e) => e.stopPropagation()}
            >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Excel</span>
                <Download className="h-3 w-3 opacity-50" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-8 px-2 gap-2 flex items-center transition-all",
                    report.status === 'in-progress-epm' ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50 hover:text-red-700"
                )}
                disabled={report.status === 'in-progress-epm'}
                onClick={(e) => e.stopPropagation()}
            >
                <FileText className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                <Download className="h-3 w-3 opacity-50" />
            </Button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Filter Bar */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search period..."
                        className="pl-9 h-10 border-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
                    <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                        <SelectTrigger className="w-full md:w-[150px] h-10 border-border">
                            <SelectValue placeholder="Period Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full md:w-[180px] h-10 border-border">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in-progress-epm">In Progress (EPM)</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full md:w-[120px] h-10 border-border">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reports Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                            <TableHead className="px-6 py-4 w-[10px]"></TableHead>
                            <TableHead className="px-6 py-4">Reporting Period</TableHead>
                            <TableHead className="px-6 py-4">Period Type</TableHead>
                            <TableHead className="px-6 py-4">Consolidation Status</TableHead>
                            <TableHead className="px-6 py-4 text-center">Closing Date</TableHead>
                            <TableHead className="px-6 py-4 text-center">Final Approval</TableHead>
                            <TableHead className="px-6 py-4 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groupedData.length > 0 ? (
                            groupedData.map((group) => (
                                <React.Fragment key={group.year}>
                                    {/* Parent Yearly Row (FY) */}
                                    <TableRow
                                        className="cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors border-b border-border font-bold"
                                        onClick={() => toggleYear(group.year)}
                                    >
                                        <TableCell className="px-6 py-4 text-center">
                                            {expandedYears[group.year] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {group.parent?.period || `FY-${group.year}`}
                                                {group.parent?.status === 'closed' && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                                {group.parent?.type || 'Yearly'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {group.parent && <StatusBadge status={group.parent.status} />}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center text-sm">
                                            {group.parent?.closingDate || '—'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center text-sm font-medium">
                                            {group.parent?.finalApprovalDate || '—'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center">
                                            {group.parent && <ActionButtons report={group.parent} />}
                                        </TableCell>
                                    </TableRow>

                                    {/* Child Quarter Rows */}
                                    {expandedYears[group.year] && group.children.map((report) => (
                                        <TableRow key={report.id} className="hover:bg-muted/5 transition-colors border-b border-border/50">
                                            <TableCell className="px-6 py-4"></TableCell>
                                            <TableCell className="px-6 py-4 pl-12 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {report.period}
                                                    {report.status === 'closed' && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                                                    {report.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <StatusBadge status={report.status} />
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center text-muted-foreground text-sm">
                                                {report.closingDate}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center text-muted-foreground text-sm font-medium">
                                                {report.finalApprovalDate || '—'}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <ActionButtons report={report} isExpandedMode={true} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    No consolidated reports found for the selected filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Contextual Assistant */}
            <BizziAIChatbot />
        </div>
    );
}
