import { BarChart3, ChevronRight, CircleAlert, MessagesSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ds/Button';
import useCanManageBilling from '@/hooks/useCanManageBilling';
import './EmptyState.css';

const BILLING_MANAGER_COPY = {
    title: 'Your coaching starts here',
    body: 'Choose a plan to unlock your AI coach, personalized tips, and insights into your conversations.',
};

const TEAM_MEMBER_COPY = {
    title: "Your company doesn't have an active plan",
    body: 'Contact your account owner to get access to Sayso.',
};

export default function EmptyState() {
    const navigate = useNavigate();
    const canManageBilling = useCanManageBilling();
    const copy = canManageBilling ? BILLING_MANAGER_COPY : TEAM_MEMBER_COPY;

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
                    <h2 className='dashboardEmpty__title'>{copy.title}</h2>
                    <p className='dashboardEmpty__body'>{copy.body}</p>
                </div>
                {canManageBilling && (
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
                )}
            </section>
        </main>
    );
}
