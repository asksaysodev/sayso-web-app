import { useState } from "react";
import { LuChevronRight, LuBuilding, LuPaperclip} from 'react-icons/lu'

import Divider from "./Divider";

import '../styles/ProspectCard.css';
import { Prospect } from "@/types/coach";

interface Props {
    handleSelectProspect: (prospect: Prospect) => void;
    prospect: Prospect;
}

export default function ProspectCard({ handleSelectProspect, prospect }: Props) {

    //STATE
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="prospect-card-container">
            {
                isHovered && (
                    <div className="outline"></div>
                )
            }
            <div className='prospect-card'>
                <div className='prospect-card-header'>
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
                    <div className="prospect-card-header-actions">
                        <div className="expand-button" onClick={() => handleSelectProspect(prospect)}>
                            <LuChevronRight />
                        </div>
                    </div>
                </div>
                <Divider />
                <div className='prospect-card-body'>
                    <div className="prospect-row" style={{marginBottom: '16px'}}>
                        <div className="prospect-row-icon-container">
                            <LuBuilding />
                            <p>Company:</p>
                        </div>
                        <p>{prospect.company}</p>
                    </div>
                    <div className="prospect-row">
                        <div className="prospect-row-icon-container">
                            <LuPaperclip />
                            <p>Related Files:</p>
                        </div>
                        <p>{prospect.files.length}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}