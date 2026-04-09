import { LuBellRing, LuX } from 'react-icons/lu';
import './styles.css';
import SaysoButton from '../SaysoButton';

interface Props {
    children?: React.ReactNode;
}

export default function SpotlightWidget({ children = null }: Props) {
    return (
        <div className='spotlight-widget-overlay'>
            <div className='spotlight-widget'>
                <div className='slw-header'>
                    <div className='slw-header-left-container'>
                        <span className='slw-header-title'>Feature Name</span>
                        <span className='slw-header-description'>Check out how the released feature works!</span>
                    </div>
                    <button className='slw-header-luX-btn'>
                        <LuX />
                    </button>
                </div>

                <div className='slw-content-container'>
                    <div className='slw-content'>
                        {children}
                    </div>
                </div>

                <div className='slw-footer'>
                    <SaysoButton
                        label={'Remind Me Later'}
                        icon={<LuBellRing />}
                        variant='outlined'
                    />
                </div>
            </div>
        </div>
    )
}