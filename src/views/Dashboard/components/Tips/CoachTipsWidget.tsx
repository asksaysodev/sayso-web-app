import saysoLogo from '/assets/sayso.svg';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import WidgetCard from '../widget/WidgetCard';
import WidgetErrorState from '../widget/WidgetErrorState';
import TipsPager from './TipsPager';
import TipCardSkeleton from './TipCardSkeleton';
import useDashboardTips from '../../hooks/useDashboardTips';
import './Tips.css';

const SKELETON_CARDS = ['tip-1', 'tip-2', 'tip-3'];

export default function CoachTipsWidget() {
    const { tips, scopeKey, isError, isRetrying, retry } = useDashboardTips();
    const isMobile = useMediaQuery('(max-width: 767px)');

    const renderBody = () => {
        if (isError) return <WidgetErrorState subject='coach tips' onRetry={retry} isRetrying={isRetrying} />;
        if (!tips) {
            return (
                <div className='dashboard-tips__grid'>
                    {(isMobile ? SKELETON_CARDS.slice(0, 1) : SKELETON_CARDS).map((id) => <TipCardSkeleton key={id} />)}
                </div>
            );
        }
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
