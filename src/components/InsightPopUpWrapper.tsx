import { useState, useEffect } from 'react';
import { useSalesCoachContext } from '../context/SalesCoachContext';
import InsightPopUp from './InsightPopUp';
import { InsightMessage } from '@/types/coach';

export default function InsightPopUpWrapper() {

    const [displayMessage, setDisplayMessage] = useState<InsightMessage | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const { currentInsight } = useSalesCoachContext();

    const handleClose = (isIceBreaker: boolean): void => {

        setTimeout(() => {
            setIsClosing(true);
            setTimeout(() => {
                setDisplayMessage(null);
                
            }, 200);
        }, isIceBreaker ? 15000 : 12000); 

    }

    useEffect(() => {
        if (currentInsight && currentInsight.message && currentInsight.message !== '') {
            
            setIsClosing(false);
            if(currentInsight.isIceBreaker) {
                setTimeout(() => {
                    setDisplayMessage(currentInsight);
                    handleClose(true)
                }, 3000);
            } else {
                setDisplayMessage(currentInsight);
                handleClose(false)
            }
        } 
    }, [currentInsight]);

    return (
        <>
            {displayMessage && (
                <InsightPopUp 
                    message={displayMessage.message} 
                    isIceBreaker={displayMessage.isIceBreaker}
                    isClosing={isClosing} 
                />
            )}
        </>
    );
} 