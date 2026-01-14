import React, { useState, useMemo } from 'react';
import {
    Search,
    Eye,
    AlertCircle,
    RotateCcw,
    FileText,
    Send,
    Calendar as CalendarIcon,
    Loader2
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getPersistentBUTasks, updateBUTaskStatus, BUTask } from '@/data/buTasksData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function BUViewDashboard() {
    const [tasks, setTasks] = useState<BUTask[]>(getPersistentBUTasks());
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [maxSla, setMaxSla] = useState<string>('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedTask, setSelectedTask] = useState<{ task: BUTask, index: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // SLA Calculation
    const calculateSLA = (dueDateStr: string) => {
        const due = new Date(dueDateStr);
        const now = new Date('2026-01-13'); // Fixed current date for mock consistency
        const diffTime = due.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Filters logic
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.owner.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'all' || task.status === statusFilter;

            const sla = calculateSLA(task.dueDate);
            const matchSla = maxSla === '' || sla <= parseInt(maxSla);

            const matchDate = dateFilter === '' || task.dueDate === dateFilter;

            return matchSearch && matchStatus && matchSla && matchDate;
        });
    }, [tasks, searchTerm, statusFilter, maxSla, dateFilter]);

    const getStatusConfig = (status: BUTask['status']) => {
        switch (status) {
            case 'Open': return { label: 'Open', className: 'bg-blue-100 text-blue-800 border-blue-200' };
            case 'Sent': return { label: 'Sent', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
            case 'Reject': return { label: 'Reject', className: 'bg-red-100 text-red-800 border-red-200' };
            case 'Approve': return { label: 'Approve', className: 'bg-green-100 text-green-800 border-green-200' };
            case 'In Progress': return { label: 'In Progress', className: 'bg-gray-100 text-gray-800 border-gray-200' };
            default: return { label: status, className: 'bg-gray-100 text-gray-800' };
        }
    };

    const stats = useMemo(() => {
        return {
            total: tasks.length,
            open: tasks.filter(t => t.status === 'Open').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            sent: tasks.filter(t => t.status === 'Sent').length,
            urgent: tasks.filter(t => calculateSLA(t.dueDate) <= 1).length
        };
    }, [tasks]);

    const handleConfirmAction = () => {
        if (!selectedTask) return;

        setIsProcessing(true);

        // Simulate process
        setTimeout(() => {
            const updatedTasks = [...tasks];
            const task = { ...updatedTasks[selectedTask.index] };

            if (task.status === 'Open' || task.status === 'Reject') {
                task.status = 'Sent';
            }

            updatedTasks[selectedTask.index] = task;

            // Persist to mock data source
            updateBUTaskStatus(selectedTask.index, task.status);

            setTasks(updatedTasks);

            setIsProcessing(false);
            setSelectedTask(null);
            toast.success(`Process completed successfully for ${task.name}!`);
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Context Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">BU CLOSING TASK DASHBOARD</h1>
                    <div className="flex gap-6 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1.5">Entity: <span className="font-bold text-foreground">Tasco Auto JSC</span></span>
                        <span className="flex items-center gap-1.5">Reporting Period: <span className="font-bold text-foreground">Jan-2026</span></span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 px-4 flex items-center gap-2" onClick={() => toast.info('Refreshing dashboard...')}>
                        <RotateCcw className="h-4 w-4" />
                        Refresh Status
                    </Button>
                    <Button variant="outline" className="h-10 px-4 flex items-center gap-2" onClick={() => toast.info('Exporting task list...')}>
                        <FileText className="h-4 w-4" />
                        Export Task List
                    </Button>
                </div>
            </div>

            {/* Tasks Table Section */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border bg-muted/10">
                    <h2 className="font-semibold text-lg">Tasks Overview</h2>
                </div>

                <div className="p-4 bg-muted/5 border-b border-border grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wider">Owner</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                placeholder="Search by owner..."
                                className="pl-9 h-9 border-border bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wider">Status</label>
                        <select
                            className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 transition-all"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="Sent">Sent</option>
                            <option value="Reject">Reject</option>
                            <option value="Approve">Approve</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wider">Due Date</label>
                        <Input
                            type="date"
                            className="h-9 bg-background border-border"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wider">Max SLA</label>
                        <Input
                            type="number"
                            placeholder="e.g. 2"
                            className="h-9 bg-background border-border"
                            value={maxSla}
                            onChange={(e) => setMaxSla(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    {/* Fixed Header Table */}
                    <div className="border-b border-border bg-muted/95 backdrop-blur-sm z-30 shadow-sm">
                        <Table className="table-fixed w-full">
                            <TableHeader>
                                <TableRow className="transition-colors hover:bg-transparent border-none">
                                    <TableHead className="h-12 w-[28%] text-left align-middle px-6 py-3 font-semibold text-foreground">Task Name</TableHead>
                                    <TableHead className="h-12 w-[22%] text-left align-middle px-6 py-3 font-semibold text-foreground">Owner</TableHead>
                                    <TableHead className="h-12 w-[15%] text-left align-middle px-6 py-3 font-semibold text-foreground">Status</TableHead>
                                    <TableHead className="h-12 w-[12%] text-left align-middle px-6 py-3 font-semibold text-foreground">Due Date</TableHead>
                                    <TableHead className="h-12 w-[12%] align-middle px-6 py-3 font-semibold text-foreground text-center">SLA (days)</TableHead>
                                    <TableHead className="h-12 w-[11%] align-middle px-6 py-3 font-semibold text-foreground text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>

                    {/* Scrollable Body Table */}
                    <div className="max-h-[325px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30 transition-colors">
                        <Table className="table-fixed w-full">
                            <TableBody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task, index) => {
                                        const sla = calculateSLA(task.dueDate);
                                        const isUrgent = sla <= 0;
                                        const status = getStatusConfig(task.status);

                                        return (
                                            <TableRow key={index} className={cn("hover:bg-muted/5 transition-colors border-b border-border/50", isUrgent && "bg-destructive/5")}>
                                                <TableCell className="w-[28%] px-6 py-4 font-medium truncate" title={task.name}>{task.name}</TableCell>
                                                <TableCell className="w-[22%] px-6 py-4 text-muted-foreground text-sm truncate" title={task.owner}>{task.owner}</TableCell>
                                                <TableCell className="w-[15%] px-6 py-4">
                                                    <Badge variant="outline" className={cn("px-2.5 py-0.5 font-semibold text-[11px] whitespace-nowrap", status.className)}>
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="w-[12%] px-6 py-4 text-muted-foreground text-sm whitespace-nowrap">{task.dueDate}</TableCell>
                                                <TableCell className={cn("w-[12%] px-6 py-4 text-center font-bold text-sm", sla <= 0 ? "text-destructive" : "text-muted-foreground")}>
                                                    {sla}
                                                </TableCell>
                                                <TableCell className="w-[11%] px-6 py-4 text-center">
                                                    {(task.status !== 'Sent' && task.status !== 'Approve') && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setSelectedTask({ task, index })}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            No tasks found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Summary Section at the Bottom */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 overflow-hidden">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Deadline & SLA Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Tasks Summary */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Volume Overview</span>
                        </div>
                        <div className="flex flex-col flex-1 justify-center py-2">
                            <span className="text-4xl font-black tracking-tight text-foreground">{stats.total}</span>
                            <span className="text-[11px] font-medium text-muted-foreground mt-1">Total assignments this period</span>
                        </div>
                    </div>

                    {/* Status Breakdown Summary */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                <RotateCcw className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Execution Status</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 flex-1 justify-center py-1">
                            <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/50">
                                <span className="text-[12px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Open
                                </span>
                                <span className="text-sm font-black text-foreground">{stats.open}</span>
                            </div>
                            <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/50">
                                <span className="text-[12px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> In Progress
                                </span>
                                <span className="text-sm font-black text-foreground">{stats.inProgress}</span>
                            </div>
                            <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/50">
                                <span className="text-[12px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sent
                                </span>
                                <span className="text-sm font-black text-foreground">{stats.sent}</span>
                            </div>
                        </div>
                    </div>

                    {/* Urgent Priority Summary */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all group overflow-hidden relative">
                        {stats.urgent > 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-rose-500/10 transition-all pointer-events-none" />}
                        <div className="flex items-center gap-3 mb-6 relative">
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-rose-600/80">Priority Alert</span>
                        </div>

                        {stats.urgent > 0 ? (
                            <div className="flex-1 space-y-4 relative">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black tracking-tight text-rose-600">{stats.urgent}</span>
                                    <span className="text-l font-bold text-rose-500/60 uppercase tracking-tighter">High Alert Tasks</span>
                                </div>
                                <div className="space-y-1.5">
                                    {tasks.filter(t => calculateSLA(t.dueDate) <= 1).slice(0, 2).map((t, i) => (
                                        <div key={i} className="text-[12px] font-semibold text-rose-700 bg-rose-500/5 px-3 py-2 rounded-lg border border-rose-500/10 truncate hover:bg-rose-500/10 transition-colors">
                                            {t.name}
                                        </div>
                                    ))}
                                    {stats.urgent > 2 && (
                                        <div className="text-[11px] font-black text-rose-400 uppercase tracking-widest pl-3 pt-1">
                                            + {stats.urgent - 2} more critical items
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-rose-600/30 gap-1.5 opacity-60">
                                <div className="w-8 h-8 rounded-full border border-rose-500/20 flex items-center justify-center">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-black">Timeline Balanced</span>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Task Details
                        </DialogTitle>
                    </DialogHeader>

                    {selectedTask && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Task Name</p>
                                    <p className="font-semibold">{selectedTask.task.name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Status</p>
                                    <Badge variant="outline" className={cn("px-2 py-0", getStatusConfig(selectedTask.task.status).className)}>
                                        {selectedTask.task.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Owner</p>
                                    <p>{selectedTask.task.owner}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Due Date</p>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        <p>{selectedTask.task.dueDate}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedTask.task.status === 'Reject' && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-100 italic">
                                    <p className="text-xs text-red-800 font-bold mb-1 flex items-center gap-1 uppercase tracking-wider">
                                        <AlertCircle className="h-3 w-3" /> Rejection Reason
                                    </p>
                                    <p className="text-[13px] text-red-700 leading-relaxed">
                                        "{selectedTask.task.reason || 'No reason provided'}"
                                    </p>
                                </div>
                            )}

                            <DialogFooter className="pt-2 border-t border-border mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTask(null)}
                                    disabled={isProcessing}
                                    className="h-10"
                                >
                                    Close
                                </Button>
                                <Button
                                    className="gap-2 h-10 w-full sm:w-auto"
                                    onClick={handleConfirmAction}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {isProcessing ? 'Processing...' : 'Confirm Action'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
