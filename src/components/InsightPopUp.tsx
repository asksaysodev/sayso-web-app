import '../styles/GlassedInsight.css';

interface Props {
    message: string;
    isClosing: boolean;
    isIceBreaker: boolean;
}

export default function InsightPopUp({ message, isClosing, isIceBreaker }: Props) { 

    return (
        <div className="glassed-insight-container-wrapper">
            <div className={`glassed-insight-container ${isClosing ? 'closing' : ''}`}>
                <h1>{isIceBreaker && '🧊 Ice Breaker: '}{message}</h1>
            </div>
        </div>
    )
}

