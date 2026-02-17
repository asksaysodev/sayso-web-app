type ValidationStatus = 'short' | 'good' | 'long' | 'too-long';
export type CharacterCounterType = 'signal_description' | 'signal_instructions';

function getValidationStatus(length: number, type?: CharacterCounterType): ValidationStatus {
    if (type === 'signal_description') {
        if (length < 250) return 'short';
        if (length < 700) return 'good';
        if (length < 1050) return 'long';
        return 'too-long';
    }

    if (type === 'signal_instructions') {
        if (length < 250) return 'short';
        if (length < 650) return 'good';
        if (length < 900) return 'long';
        return 'too-long';
    }


    if (length < 150) return 'short';
    if (length < 320) return 'good';
    if (length < 380) return 'long';
    return 'too-long';
}

interface CharacterCounterProps {
    text: string;
    type?: CharacterCounterType;
}

export default function CharacterCounter({ text, type }: CharacterCounterProps) {
    if (!text) return null;
    
    const length = text.length;
    const status = getValidationStatus(length, type);
    
    const statusConfig = {
        'short': { label: 'Short', color: '#f59e0b' },
        'good': { label: 'Good', color: '#10b981' },
        'long': { label: 'Long', color: '#f97316' },
        'too-long': { label: 'Too Long', color: '#ef4444' }
    };
    
    const { label, color } = statusConfig[status];
    
    if (length === 0) return null;

    return (
        <div style={{ 
            display: 'flex', 
            fontSize: '12px',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'flex-end',
            color: color,
            fontWeight: 500
        }}>
            <span>{label}</span>
            <span>-</span>
            <span>{length} chars</span>
        </div>  
    );
}
