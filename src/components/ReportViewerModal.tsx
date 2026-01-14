import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Report } from '@/types/finance';
import { validationMessages } from '@/data/mockData';
import { AlertCircle, AlertTriangle, Info, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportViewerModalProps {
  open: boolean;
  onClose: () => void;
  report: Report;
}

export function ReportViewerModal({ open, onClose, report }: ReportViewerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {report.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Mock Report Preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <div className="text-center text-muted-foreground py-8">
              <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Report Preview</p>
              <p className="text-sm mt-1">
                {report.metadata.format} file from {report.metadata.sourceSystem}
              </p>
            </div>

            {/* Mock Data Table */}
            <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Account</th>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                    <th className="px-4 py-2 text-right font-medium">Debit</th>
                    <th className="px-4 py-2 text-right font-medium">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2 font-mono">1100</td>
                    <td className="px-4 py-2">Cash and Cash Equivalents</td>
                    <td className="px-4 py-2 text-right">$2,450,000</td>
                    <td className="px-4 py-2 text-right">—</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">1200</td>
                    <td className="px-4 py-2">Accounts Receivable</td>
                    <td className="px-4 py-2 text-right">$1,875,000</td>
                    <td className="px-4 py-2 text-right">—</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">1300</td>
                    <td className="px-4 py-2">Inventory</td>
                    <td className="px-4 py-2 text-right">$3,200,000</td>
                    <td className="px-4 py-2 text-right">—</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">2100</td>
                    <td className="px-4 py-2">Accounts Payable</td>
                    <td className="px-4 py-2 text-right">—</td>
                    <td className="px-4 py-2 text-right">$1,650,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">3100</td>
                    <td className="px-4 py-2">Retained Earnings</td>
                    <td className="px-4 py-2 text-right">—</td>
                    <td className="px-4 py-2 text-right">$5,875,000</td>
                  </tr>
                </tbody>
                <tfoot className="bg-muted font-medium">
                  <tr>
                    <td colSpan={2} className="px-4 py-2">Total</td>
                    <td className="px-4 py-2 text-right">$7,525,000</td>
                    <td className="px-4 py-2 text-right">$7,525,000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Validation Alerts */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold mb-4">Validation Alerts</h3>
            <div className="space-y-3">
              {validationMessages
                .filter(m => m.type !== 'error')
                .map((message, index) => (
                  <ValidationAlert key={index} {...message} />
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ValidationAlertProps {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  field?: string;
}

function ValidationAlert({ type, code, message, field }: ValidationAlertProps) {
  const config = {
    error: {
      icon: AlertCircle,
      bg: 'bg-status-rejected-bg',
      border: 'border-status-rejected/30',
      iconColor: 'text-status-rejected',
      textColor: 'text-status-rejected-foreground',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-status-received-bg',
      border: 'border-status-received/30',
      iconColor: 'text-status-received',
      textColor: 'text-status-received-foreground',
    },
    info: {
      icon: Info,
      bg: 'bg-status-in-review-bg',
      border: 'border-status-in-review/30',
      iconColor: 'text-status-in-review',
      textColor: 'text-status-in-review-foreground',
    },
  };

  const { icon: Icon, bg, border, iconColor, textColor } = config[type];

  return (
    <div className={cn('rounded-lg border p-3 flex items-start gap-3', bg, border)}>
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', iconColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-mono', textColor)}>{code}</span>
          {field && (
            <span className="text-xs text-muted-foreground">• {field}</span>
          )}
        </div>
        <p className={cn('text-sm mt-0.5', textColor)}>{message}</p>
      </div>
    </div>
  );
}
