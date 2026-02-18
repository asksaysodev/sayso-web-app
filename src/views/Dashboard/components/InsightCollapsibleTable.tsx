import dayjs from 'dayjs';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { LuPlus, LuMinus } from 'react-icons/lu';
import './InsightCollapsibleTable.css';
import { Insight } from '@/types/coach';
import useUpdateInsights from '../hooks/useUpdateInsights';
import { InsightRating } from '../types';
import {FaRegThumbsDown,FaRegThumbsUp,FaThumbsDown,FaThumbsUp} from 'react-icons/fa6';

const LEAD_TYPE_MAP = {
    'buyer': 'Buyer',
    'seller': 'Seller',
    'all': 'All',
}

interface Props {
    groupDate: string;
    groupInsights: Insight[];
    openedInsights: string[];
    setOpenedInsights: Dispatch<SetStateAction<string[]>>;
}

export default function InsightCollapsibleTable({ groupDate, groupInsights, openedInsights, setOpenedInsights }: Props) {
    const {updateInsightRating } = useUpdateInsights();
    const isCollapsed = !openedInsights.includes(groupDate);

    const handleCollapsible = (id: string) => {
        setOpenedInsights((prev) => {
            if (prev.length === 0) return [id]

            if (prev.includes(id)) {
                const newIds = prev.filter(i => i !== id)
                return [...newIds]
            } else {
                return [...prev, id]
            }
        })
    }

    const handleUpdateInsightRating = (insightId: string, currentRating: InsightRating, newRating: InsightRating) => {
        if (!insightId) return;

        if (currentRating === newRating) return;

        updateInsightRating({ insightId, rating: newRating });
    }

    return (
        <div className='collapsible-wrapper'>
            <button
                className={`collapsible-group-trigger ${!isCollapsed ? 'expanded' : ''}`}
                onClick={() => handleCollapsible(groupDate)}
            >
                {dayjs(groupDate).format('ddd, MMM D')}

                {isCollapsed ? <LuPlus /> :  <LuMinus />}
            </button>

            <div className={`table-container ${!isCollapsed ? 'expanded' : 'collapsed'}`}>
                <table className='insights-table'>
                    <thead>
                        <tr className='table-header'>
                            <th>Time</th>
                            <th>Insights</th>
                            <th>Lead Type</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupInsights.map(({ id, timestamp, message, lead_type, rating = null }, index) => {
                            const isLastItem = index === groupInsights.length - 1;
                            return (
                                <Fragment key={id}>
                                    <tr key={id} className='table-row'>
                                        <td className='time-cell'>
                                            {dayjs(timestamp).format('h:mm A')}
                                        </td>
                                        <td className='insight-cell'>
                                            {message}
                                        </td>
                                        <td className='lead-type-cell'>
                                            {LEAD_TYPE_MAP[lead_type]}
                                        </td>
                                        <td className='rate-cell'>
                                            <button
                                                className={`rate-button ${rating === 'up' ? 'active' : ''}`}
                                                onClick={() => handleUpdateInsightRating(id, rating, 'up')}
                                                aria-label="Thumbs up"
                                            >
                                                {rating === 'up' ? <FaThumbsUp size={18}/> : <FaRegThumbsUp size={18} />}
                                            </button>
                                            <button
                                                className={`rate-button ${rating === 'down' ? 'active' : ''}`}
                                                onClick={() => handleUpdateInsightRating(id, rating, 'down')}
                                                aria-label="Thumbs down"
                                            >
                                                {rating === 'down' ? <FaThumbsDown size={18}/> : <FaRegThumbsDown size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {!isLastItem && (
                                        <tr className='row-separator'>
                                            <td colSpan={4}>
                                                <div className='separator-line' />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}