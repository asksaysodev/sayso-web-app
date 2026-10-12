import saysoLogo from '/assets/sayso.svg';
import WidgetCard from '../widget/WidgetCard';

export default function CoachTipsWidget() {
    return (
        <WidgetCard
            className='dashboard-grid__tips'
            icon={<img src={saysoLogo} width={20} height={20} alt='' />}
            title='Coach Tips'
        />
    );
}
