import { MessagesSquare, Rocket } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { LAUNCH_COACH_URL } from '@/constants';
import WidgetState from '../widget/WidgetState';

export default function TipsEmptyState() {
    return (
        <WidgetState
            className='dashboard-tips__empty'
            icon={<MessagesSquare size={32} />}
            tone='primary'
            title='Your coach tips are on the way'
            text='Have more conversations and activities to help us identify patterns and generate personalized tips. Your tips will appear here once we have enough information.'
            action={
                <Button
                    leftIcon={<Rocket size={20} />}
                    className='dashboard-tips__launch'
                    onClick={() => { window.location.href = LAUNCH_COACH_URL; }}
                >
                    Launch Coach
                </Button>
            }
        />
    );
}
