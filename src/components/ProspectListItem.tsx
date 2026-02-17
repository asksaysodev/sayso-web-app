import { useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import '../styles/ProspectListItem.css';
import { Prospect } from '@/types/coach';

interface Props {
    handleSelectProspect: (prospect: Prospect) => void;
    prospect: Prospect;
}

export default function ProspectListItem({ handleSelectProspect, prospect }: Props) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='prospect-list-item'>
            <div className='prospect-list-item-divider'></div>
            {
                isHovered && (
                    <div className="outline">

                    </div>
                )
            }
            <div className='prospect-list-item-content'>
                <div className='prospect-list-name prospect-item-content-div'>
                    <div className="prospect-card-header-content">
                        <div className="prospect-card-header-image-container">
                            <div className="prospect-initials">
                                <p>{`${prospect.name.charAt(0).toUpperCase()}${prospect.lastname.charAt(0).toUpperCase()}`}</p>
                            </div>
                        </div>
                        <div className="prospect-card-header-content-info">
                            <h3>{prospect.name}</h3>
                            <p>{prospect.email}</p>
                        </div>
                    </div>
                </div>
                <div className='prospect-list-company prospect-item-content-div'>
                    <p>{prospect.company}</p>
                </div>
                <div className='prospect-list-files prospect-item-content-div'>
                    <div className='prospect-list-file-badge'>
                        <p>{prospect.files.length}</p>
                    </div>
                </div>
                <div className='prospect-list-action prospect-item-content-div'>
                    <div className='prospect-list-action-button' onClick={() => handleSelectProspect(prospect)}>
                        <p>View Details</p>
                        <LuChevronRight />
                    </div>
                </div>
            </div>
        </div>
    )
}