import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '@/assets/Blue-1.svg';
import {
  LayoutDashboard,
  Building2,
  FileCheck,
  BarChart3,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const navigation = [
  { name: 'Group Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Consolidated Reports', href: '/consolidated-reports', icon: FileCheck },
  { name: 'Group Management Overview', href: '/management-overview', icon: BarChart3 },
];

export function AppLayout({ children, breadcrumbs, title, subtitle, actions }: AppLayoutProps) {
  const location = useLocation();
  const { viewMode } = useViewMode();

  const currentNavigation = viewMode === 'HO'
    ? navigation
    : [{ name: 'BU Dashboard', href: '/', icon: LayoutDashboard }];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <img src={logo} alt="Bizzi" className="h-8 w-auto object-contain" />
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              {viewMode === 'HO' ? 'Group Finance' : 'BU Operations'}
            </h1>
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              {viewMode === 'HO' ? 'Closing Portal' : 'Regional Portal'}
            </p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {currentNavigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Q4 2025 Closing</span>
            </div>
            <p className="mt-1 text-sm font-medium">Deadline: Jan 20, 2026</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">MV</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Mai Vy</p>
                  <p className="text-xs text-muted-foreground">Group Controller</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page header */}
        {(title || actions) && (
          <div className="border-b border-border bg-card px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
