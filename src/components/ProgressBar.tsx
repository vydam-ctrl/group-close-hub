import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, className, showLabel = true, size = 'md' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getColorClass = (val: number) => {
    if (val === 100) return 'bg-status-completed';
    if (val >= 75) return 'bg-status-in-progress';
    if (val >= 50) return 'bg-status-received';
    if (val > 0) return 'bg-status-late';
    return 'bg-status-not-started';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 rounded-full bg-muted overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', getColorClass(clampedValue))}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground w-12 text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
