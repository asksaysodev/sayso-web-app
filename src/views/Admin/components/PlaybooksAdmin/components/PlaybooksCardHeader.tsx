import { RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import '../styles/PlaybooksCardHeader.css';

interface Props {
    count?: number;
    isRefreshing: boolean;
    onRefresh: () => void;
    onUpload: () => void;
}

export default function PlaybooksCardHeader({ count, isRefreshing, onRefresh, onUpload }: Props) {
    return (
        <div className='playbooks-header'>
            <div className='playbooks-header__titles'>
                <div className='playbooks-header__title-row'>
                    <h2 className='playbooks-header__title'>Public playbooks</h2>
                    {count !== undefined && <span className='playbooks-header__count'>{count}</span>}
                </div>
                <p className='playbooks-header__subtitle'>Scripts every Sayso user can see and set as their default.</p>
            </div>
            <div className='playbooks-header__controls'>
                <Button variant='secondary' size='sm' leftIcon={<RefreshCw size={16} />} loading={isRefreshing} onClick={onRefresh}>
                    Refresh
                </Button>
                <Button leftIcon={<Upload size={20} />} onClick={onUpload}>
                    Upload playbook
                </Button>
            </div>
        </div>
    );
}
