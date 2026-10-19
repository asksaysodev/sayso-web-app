import { useSearchParams } from 'react-router-dom';
import { Building2, UsersRound } from 'lucide-react';
import { PageHeader } from '@/components/ds/PageHeader';
import { SegmentedControl, type SegmentedControlItem } from '@/components/ds/SegmentedControl';
import CompanyMembersCard from './Company/components/CompanyMembersCard';
import TeamsCard from './Teams/components/TeamsCard';
import type { OrganizationTab } from './types';
import './Organization.css';

const TABS: SegmentedControlItem<OrganizationTab>[] = [
    { value: 'company', label: 'Company', icon: <Building2 size={16} /> },
    { value: 'teams', label: 'Teams', icon: <UsersRound size={16} /> },
];

const DEFAULT_TAB: OrganizationTab = 'company';

const isOrganizationTab = (value: string | null): value is OrganizationTab =>
    TABS.some((tab) => tab.value === value);

export default function Organization() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const activeTab = isOrganizationTab(tabParam) ? tabParam : DEFAULT_TAB;

    const handleTabChange = (tab: OrganizationTab) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set('tab', tab);
                return next;
            },
            { replace: true },
        );
    };

    return (
        <main className='organization-page'>
            <PageHeader
                title='Organization'
                description='See how your org is doing as a whole, by team, or by individual — and manage who belongs where.'
            />
            <SegmentedControl
                aria-label='Organization view'
                items={TABS}
                value={activeTab}
                onChange={handleTabChange}
            />
            {activeTab === 'company' ? <CompanyMembersCard /> : <TeamsCard />}
        </main>
    );
}
