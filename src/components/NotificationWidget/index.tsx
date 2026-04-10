import { useState } from 'react';
import { LuBellRing, LuX, LuExpand, LuShrink, } from 'react-icons/lu';
import './styles.css';
import SaysoButton from '../SaysoButton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { NotificationBottomSheet } from './NotificationBottomSheet';

interface Props {
    children?: React.ReactNode;
    displayType?: 'expanded' | 'collapsed';
}

export default function NotificationWidget({ displayType = 'collapsed', children = null }: Props) {
    const [isCollapsed, setIsCollapsed] = useState(displayType === 'collapsed');
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) {
        return <NotificationBottomSheet>{children}</NotificationBottomSheet>;
    }

    return (
        <div className={`nw-overlay ${isCollapsed ? 'nw-overlay--collapsed' : 'nw-overlay--expanded'}`}>
            <div className={`notification-widget ${isCollapsed ? 'notification-widget--collapsed' : 'notification-widget--expanded'}`}>

                {/* Header */}
                <div className='nw-header'>
                    <div className='nw-header-left-container'>
                        <span className='nw-header-title'>Notification's Title</span>
                        {!isCollapsed && (
                            <span className='nw-header-description'>Check out how the released feature works!</span>
                        )}
                    </div>
                    <div className='nw-header-actions'>
                        <button className='nw-header-btn' onClick={() => setIsCollapsed(prev => !prev)}>
                            {isCollapsed ? <LuExpand /> : <LuShrink />}
                        </button>
                        <button className='nw-header-btn'>
                            <LuX />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='nw-content-container'>
                    <div className='nw-content'>
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className='nw-footer'>
                    <SaysoButton
                        label='Remind Me Later'
                        icon={<LuBellRing />}
                        variant='outlined'
                    />
                </div>

            </div>
        </div>
    );
}
