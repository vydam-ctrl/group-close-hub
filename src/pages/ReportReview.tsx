import { useState } from 'react';
import { Report, ReportStatus } from '@/types/finance';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getBUDetails, getReportById, validationMessages, updateReportStatus } from '@/data/mockData';
import { ReportViewerModal } from '@/components/ReportViewerModal';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  User,
  Clock,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ReportReview() {
  const { buId, reportId } = useParams<{ buId: string; reportId: string }>();
  const navigate = useNavigate();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year');
  const selectedYear = yearParam ? parseInt(yearParam) : new Date().getFullYear() - 1;

  const details = getBUDetails(buId || '', selectedYear);
  const reportData = getReportById(buId || '', reportId || '', selectedYear);
  const [report, setReport] = useState<Report | undefined>(reportData);

  if (!details || !report) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">Report not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(`/bu/${buId}`)}>
            Back to BU Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { bu } = details;

  const handleApprove = () => {
    if (!report) return;

    const updatedReport: Report = {
      ...report,
      status: 'approved',
      decisionDate: new Date().toISOString(),
    };

    // Persist to mock data source
    updateReportStatus(buId || '', reportId || '', 'approved', updatedReport.decisionDate);

    setReport(updatedReport);
    toast.success('Report Approved Successfully', {
      description: `${report.name} has been marked as approved for ${bu.name}.`,
    });

    // Optional: delay navigation to show feedback
    setTimeout(() => {
      navigate(`/bu/${buId}`);
    }, 2000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;

    if (!report) return;

    const updatedReport: Report = {
      ...report,
      status: 'rejected',
      decisionDate: new Date().toISOString(),
      rejectReason: rejectReason
    };

    // Persist to mock data source
    updateReportStatus(buId || '', reportId || '', 'rejected', updatedReport.decisionDate, rejectReason);

    setReport(updatedReport);
    toast.error('Report Rejected', {
      description: `Reason: ${rejectReason}`,
    });

    setShowRejectDialog(false);
    setTimeout(() => {
      navigate(`/bu/${buId}`);
    }, 2000);
  };

  const validationCounts = {
    errors: validationMessages.filter(m => m.type === 'error').length,
    warnings: validationMessages.filter(m => m.type === 'warning').length,
    info: validationMessages.filter(m => m.type === 'info').length,
  };

  return (
    <AppLayout
      title={report.name}
      subtitle={`${report.code} • ${report.type}`}
      actions={
        <Button variant="outline" onClick={() => navigate(`/bu/${buId}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <div className="relative">
              <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />
              <div className="space-y-6">
                <TimelineItem
                  icon={Calendar}
                  label="BU Submission Date"
                  value={report.buSubmissionDate
                    ? new Date(report.buSubmissionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Not yet submitted'
                  }
                  active={!!report.buSubmissionDate}
                />
                <TimelineItem
                  icon={Eye}
                  label="HO First View Date"
                  value={report.hoFirstViewDate
                    ? new Date(report.hoFirstViewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Not yet viewed'
                  }
                  active={!!report.hoFirstViewDate}
                />
                <TimelineItem
                  icon={report.status === 'approved' ? CheckCircle2 : report.status === 'rejected' ? XCircle : Clock}
                  label="Decision Date"
                  value={report.decisionDate
                    ? new Date(report.decisionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Pending decision'
                  }
                  active={!!report.decisionDate}
                  variant={report.status === 'approved' ? 'success' : report.status === 'rejected' ? 'danger' : 'default'}
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current Status:</span>
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Report Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Format</p>
                <p className="mt-1 font-medium">{report.metadata.format}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Source System</p>
                <p className="mt-1 font-medium">{report.metadata.sourceSystem}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Version</p>
                <p className="mt-1 font-medium">{report.metadata.version}</p>
              </div>
            </div>
          </div>

          {/* Validation Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Validation Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-status-approved-bg p-4 text-center">
                <CheckCircle2 className="h-6 w-6 text-status-approved mx-auto" />
                <p className="mt-2 text-2xl font-bold text-status-approved-foreground">{report.validationSummary.passed}</p>
                <p className="text-xs text-status-approved-foreground/70">Passed Checks</p>
              </div>

              <div className="rounded-lg bg-status-received-bg p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-status-received mx-auto" />
                <p className="mt-2 text-2xl font-bold text-status-received-foreground">{report.validationSummary.warnings}</p>
                <p className="text-xs text-status-received-foreground/70">Warnings</p>
              </div>
            </div>
          </div>

          {/* Reject Reason (if rejected) */}
          {report.status === 'rejected' && report.rejectReason && (
            <div className="rounded-xl border border-status-rejected/30 bg-status-rejected-bg p-6">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-status-rejected mt-0.5" />
                <div>
                  <h3 className="font-semibold text-status-rejected-foreground">Rejection Reason</h3>
                  <p className="mt-1 text-sm text-status-rejected-foreground/80">{report.rejectReason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>

            <div className="space-y-3">
              <Button
                onClick={() => setShowViewerModal(true)}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <FileText className="h-4 w-4" />
                View Report
              </Button>

              {report.status !== 'approved' && report.status !== 'rejected' && report.status !== 'locked' && (
                <>
                  <Button
                    onClick={handleApprove}
                    className="w-full justify-start gap-2 bg-status-approved hover:bg-status-approved/90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>

                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    variant="outline"
                    className="w-full justify-start gap-2 border-status-rejected/30 text-status-rejected hover:bg-status-rejected-bg"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>

            {/* Reviewer Info */}
            {report.hoReviewer && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.hoReviewer}</p>
                    <p className="text-xs text-muted-foreground">HO Reviewer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Report</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this report. This will be shared with the business unit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="bg-status-rejected hover:bg-status-rejected/90"
            >
              Reject Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Viewer Modal */}
      <ReportViewerModal
        open={showViewerModal}
        onClose={() => setShowViewerModal(false)}
        report={report}
      />
    </AppLayout>
  );
}

interface TimelineItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  active?: boolean;
  variant?: 'default' | 'success' | 'danger';
}

function TimelineItem({ icon: Icon, label, value, active, variant = 'default' }: TimelineItemProps) {
  const variantClasses = {
    default: active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
    success: 'bg-status-approved text-primary-foreground',
    danger: 'bg-status-rejected text-primary-foreground',
  };

  return (
    <div className="relative flex items-start gap-4 pl-8">
      <div className={cn(
        'absolute left-0 rounded-full p-1.5',
        variantClasses[variant]
      )}>
        <Icon className="h-3 w-3" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
