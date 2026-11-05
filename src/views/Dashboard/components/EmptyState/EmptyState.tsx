import { BarChart3, ChevronRight, CircleAlert, MessagesSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ds/Button';
import './EmptyState.css';

/** Dashboard shown to signed-in users without a subscription (Figma 727:32096). Mounts no data hooks. */
export default function EmptyState() {
    const navigate = useNavigate();

    return (
        <main className='dashboard-page'>
            <header className='dashboard-header'>
                <div className='dashboard-header__text'>
                    <div className='dashboard-header__title-row'>
                        <h1 className='dashboard-header__title'>Dashboard</h1>
                    </div>
                </div>
            </header>
            <section className='dashboardEmpty'>
                <div className='dashboardEmpty__illustration' aria-hidden='true'>
                    <img className='dashboardEmpty__logo' src='/assets/sayso.svg' alt='' />
                    <span className='dashboardEmpty__tile dashboardEmpty__tile--top'>
                        <MessagesSquare size={24} />
                    </span>
                    <span className='dashboardEmpty__tile dashboardEmpty__tile--bottom'>
                        <BarChart3 size={24} />
                    </span>
                </div>
                <div className='dashboardEmpty__text'>
                    <h2 className='dashboardEmpty__title'>Your coaching starts here</h2>
                    <p className='dashboardEmpty__body'>
                        Choose a plan to unlock your AI coach, personalized tips, and insights into your conversations.
                    </p>
                </div>
                <div className='dashboardEmpty__actions'>
                    <Button onClick={() => navigate('/signup/plan')}>
                        View plans
                        <ChevronRight size={20} />
                    </Button>
                    <p className='dashboardEmpty__note'>
                        <CircleAlert size={14} aria-hidden='true' />
                        An active subscription is required to use Sayso.
                    </p>
                </div>
            </section>
        </main>
    );
}
