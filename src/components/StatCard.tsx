import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
}

const variantClasses = {
  default: 'bg-card border-border',
  primary: 'bg-accent border-primary/20',
  success: 'bg-status-approved-bg border-status-approved/20',
  warning: 'bg-status-received-bg border-status-received/20',
  danger: 'bg-status-rejected-bg border-status-rejected/20',
  secondary: 'bg-[#e9e9e9] border-border text-foreground shadow-sm',
};

const iconVariantClasses = {
  default: 'text-muted-foreground bg-muted',
  primary: 'text-primary bg-primary/10',
  success: 'text-status-approved bg-status-approved/10',
  warning: 'text-status-received bg-status-received/10',
  danger: 'text-status-rejected bg-status-rejected/10',
  secondary: 'text-zinc-100 bg-zinc-700',
};

export function StatCard({ title, value, icon: Icon, trend, className, variant = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-all duration-200 hover:shadow-md',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium",
            variant === 'secondary' ? "text-muted-foreground" : "text-muted-foreground"
          )}>{title}</p>
          <p className={cn(
            "mt-2 text-3xl font-semibold tracking-tight",
            variant === 'secondary' ? "text-foreground" : "text-foreground"
          )}>{value}</p>
          {trend && (
            <p className={cn('mt-1 text-xs', trend.value >= 0 ? 'text-status-approved' : 'text-status-rejected')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('rounded-lg p-2.5', variant === 'secondary' ? 'text-muted-foreground bg-muted' : iconVariantClasses[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
