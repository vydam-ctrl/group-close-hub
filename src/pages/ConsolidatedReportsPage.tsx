import { AppLayout } from '@/components/AppLayout';
import { ConsolidatedReports } from '@/components/ConsolidatedReports';

export default function ConsolidatedReportsPage() {
    return (
        <AppLayout
            title="Consolidated Reports"
            subtitle="Finalized consolidated financial statements by reporting period"
        >
            <ConsolidatedReports />
        </AppLayout>
    );
}
