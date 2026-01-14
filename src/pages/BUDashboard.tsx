import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getBUDetails } from '@/data/mockData';
import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ArrowLeft
} from 'lucide-react';

export default function BUDashboard() {
  const { buId } = useParams<{ buId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year');
  const selectedYear = yearParam ? parseInt(yearParam) : new Date().getFullYear() - 1;

  const details = getBUDetails(buId || '', selectedYear);

  if (!details) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">Business unit not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { bu, reportingPeriod, overallDeadline, reports, summary } = details;

  return (
    <AppLayout
      title={`${bu.name} (${bu.code})`}
      subtitle={`Submission details for ${reportingPeriod}`}
      actions={
        <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Button>
      }
    >
      <div className="space-y-8 animate-fade-in">
        {/* Context Header */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reporting Period</p>
                <p className="text-lg font-semibold">{reportingPeriod}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-status-late/10 p-2.5">
                <Clock className="h-5 w-5 text-status-late" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Deadline</p>
                <p className="text-lg font-semibold">{new Date(overallDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <StatusBadge status={bu.overallStatus} className="text-sm px-3 py-1.5" />
              <p className="text-sm text-muted-foreground">Overall Status</p>
            </div>
          </div>
        </div>

        {/* Summary Counters */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            title="Total Reports"
            value={summary.total}
            icon={FileText}
            variant="default"
          />
          <StatCard
            title="Not Sent"
            value={summary.notSent}
            icon={Clock}
            variant="secondary"
          />
          <StatCard
            title="Received"
            value={summary.received}
            icon={Send}
            variant={summary.received > 0 ? 'warning' : 'default'}
          />
          <StatCard
            title="In Review"
            value={summary.inReview}
            icon={Eye}
            variant={summary.inReview > 0 ? 'primary' : 'default'}
          />
          <StatCard
            title="Approved"
            value={summary.approved}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Rejected"
            value={summary.rejected}
            icon={XCircle}
            variant={summary.rejected > 0 ? 'danger' : 'default'}
          />
        </div>

        {/* Reports Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Required Reports</h2>
            <p className="text-sm text-muted-foreground mt-1">
              All reports and materials required for this business unit
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-24">Code</TableHead>
                <TableHead>Report Name</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>HO Reviewer</TableHead>
                <TableHead className="w-36"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow
                  key={report.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-mono text-sm font-medium">{report.code}</TableCell>
                  <TableCell>
                    <p className="font-medium">{report.name}</p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs font-medium">
                      {report.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.buSubmissionDate
                      ? new Date(report.buSubmissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—'
                    }
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(report.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.hoReviewer || '—'}
                  </TableCell>
                  <TableCell>
                    {report.status !== 'not-sent' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/bu/${buId}/report/${report.id}?year=${selectedYear}`)}
                        className="gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
