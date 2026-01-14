import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewMode } from '@/contexts/ViewModeContext';
import { BUViewDashboard } from '@/components/BUViewDashboard';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { ReportingPeriodSelector } from '@/components/ReportingPeriodSelector';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getBusinessUnitsByYear } from '@/data/mockData';
import { BusinessUnit, BUOverallStatus } from '@/types/finance';
import {
  Search,
  Building2,
  Clock,
  CheckCircle2,
  Eye,
  AlertTriangle
} from 'lucide-react';

export default function GroupDashboard() {
  const { viewMode } = useViewMode();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>(getBusinessUnitsByYear(new Date().getFullYear() - 1));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BUOverallStatus | 'all'>('all');

  const filteredBUs = businessUnits.filter(bu => {
    const matchesSearch = bu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bu.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bu.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalBUs: businessUnits.length,
    completed: businessUnits.filter(bu => bu.overallStatus === 'completed').length,
    inProgress: businessUnits.filter(bu => bu.overallStatus === 'in-progress').length,
    late: businessUnits.filter(bu => bu.overallStatus === 'late').length,
  };

  const overallProgress = Math.round(
    businessUnits.reduce((acc, bu) => acc + bu.completionPercentage, 0) / businessUnits.length
  );

  if (viewMode === 'BU') {
    return (
      <AppLayout>
        <BUViewDashboard />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Group Submission Dashboard"
      subtitle="Monitor submission and approval progress across all business units"
      actions={
        <ReportingPeriodSelector
          onPeriodChange={(period) => {
            console.log('Period changed:', period);
            const year = period.startDate.getFullYear();
            setSelectedYear(year);
            const newData = getBusinessUnitsByYear(year);
            setBusinessUnits(newData);
            toast.success('Dashboard data refreshed', {
              description: `Showing data for ${period.type} period (${year})`
            });
          }}
        />
      }
    >
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Business Units"
            value={stats.totalBUs}
            icon={Building2}
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Late"
            value={stats.late}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Overall Closing Progress</h2>
              <p className="text-sm text-muted-foreground">
                {stats.completed} of {stats.totalBUs} business units completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold tracking-tight">{overallProgress}%</span>
            </div>
          </div>
          <ProgressBar value={overallProgress} size="lg" showLabel={false} />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
            <h2 className="text-lg font-bold">Business Unit Status</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 border-border bg-background">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search BU, code or region..."
                  className="pl-9 h-9 border-border bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="w-24 font-bold">BU Code</TableHead>
                <TableHead className="font-bold">BU Name</TableHead>
                <TableHead className="text-center font-bold">Total Reports</TableHead>
                <TableHead className="text-center font-bold">Submitted</TableHead>
                <TableHead className="text-center font-bold">Approved</TableHead>
                <TableHead className="w-48 font-bold">Progress</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="w-32"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBUs.length > 0 ? (
                filteredBUs.map((bu, index) => (
                  <TableRow
                    key={bu.id}
                    className="animate-fade-in hover:bg-muted/10 transition-colors border-b border-border/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-sm font-medium">{bu.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold">{bu.name}</p>
                        <p className="text-xs text-muted-foreground">{bu.region}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted/50 text-sm font-bold">
                        {bu.totalReports}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-status-received-bg text-status-received-foreground text-sm font-bold shadow-sm">
                        {bu.submittedReports}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-status-approved-bg text-status-approved-foreground text-sm font-bold shadow-sm">
                        {bu.approvedReports}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ProgressBar value={bu.completionPercentage} size="sm" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bu.overallStatus} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/bu/${bu.id}?year=${selectedYear}`)}
                        className="gap-1.5 font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground font-medium">
                    No business units found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
