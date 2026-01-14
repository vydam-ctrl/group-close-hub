import { cn } from '@/lib/utils';
import { BUOverallStatus, ReportStatus, ConsolidationStatus } from '@/types/finance';

interface StatusBadgeProps {
  status: BUOverallStatus | ReportStatus | ConsolidationStatus;
  className?: string;
}

const statusConfig: Record<BUOverallStatus | ReportStatus | ConsolidationStatus, { label: string; className: string }> = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-status-not-started-bg text-status-not-started-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-in-progress-bg text-status-in-progress-foreground',
  },
  'in-progress-epm': {
    label: 'In Progress (on EPM)',
    className: 'bg-status-in-progress-bg text-status-in-progress-foreground',
  },
  'completed': {
    label: 'Completed',
    className: 'bg-status-completed-bg text-status-completed-foreground border border-status-completed/20',
  },
  'closed': {
    label: 'Closed',
    className: 'bg-zinc-800 text-zinc-100 border border-zinc-700',
  },
  'late': {
    label: 'Late',
    className: 'bg-status-late-bg text-status-late-foreground',
  },
  'not-sent': {
    label: 'Not Sent',
    className: 'bg-status-not-sent-bg text-status-not-sent-foreground',
  },
  'received': {
    label: 'Received',
    className: 'bg-status-received-bg text-status-received-foreground',
  },
  'in-review': {
    label: 'In Review',
    className: 'bg-status-in-review-bg text-status-in-review-foreground',
  },
  'approved': {
    label: 'Approved',
    className: 'bg-status-approved-bg text-status-approved-foreground',
  },
  'rejected': {
    label: 'Rejected',
    className: 'bg-status-rejected-bg text-status-rejected-foreground',
  },
  'locked': {
    label: 'Locked',
    className: 'bg-muted text-muted-foreground border border-border',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
