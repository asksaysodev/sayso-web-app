import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useHistoryNavigation from './useHistoryNavigation';

export default function TopbarHistoryArrows() {
    const navigate = useNavigate();
    const { canGoBack, canGoForward } = useHistoryNavigation();

    return (
        <div className='topbar__arrows'>
            <button type='button' className='topbar__arrow' aria-label='Go back' disabled={!canGoBack} onClick={() => navigate(-1)}>
                <ChevronLeft size={16} />
            </button>
            <button type='button' className='topbar__arrow' aria-label='Go forward' disabled={!canGoForward} onClick={() => navigate(1)}>
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
