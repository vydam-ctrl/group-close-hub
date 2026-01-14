import { AppLayout } from '@/components/AppLayout';
import { ManagementOverview } from '@/components/ManagementOverview';

export default function ManagementOverviewPage() {
    return (
        <AppLayout
            title="Group Management Overview"
            subtitle="Executive performance snapshot and financial KPIs"
        >
            <ManagementOverview />
        </AppLayout>
    );
}
