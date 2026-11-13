import saysoLogo from '/assets/sayso.svg';
import WidgetCard from '../widget/WidgetCard';
import WidgetErrorState from '../widget/WidgetErrorState';
import TipsPager from './TipsPager';
import TipsSkeleton from './TipsSkeleton';
import useDashboardTips from '../../hooks/useDashboardTips';
import './Tips.css';

export default function CoachTipsWidget() {
    const { tips, scopeKey, isError, isRetrying, retry } = useDashboardTips();

    const renderBody = () => {
        if (isError) return <WidgetErrorState subject='coach tips' onRetry={retry} isRetrying={isRetrying} />;
        if (!tips) return <TipsSkeleton />;
        return <TipsPager key={scopeKey} tips={tips} />;
    };

    return (
        <WidgetCard
            className='dashboard-grid__tips dashboard-tips'
            icon={<img src={saysoLogo} width={16} height={16} alt='' />}
            title='Coach Tips'
        >
            {renderBody()}
        </WidgetCard>
    );
}
